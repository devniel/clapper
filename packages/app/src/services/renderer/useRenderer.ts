'use client'

import { create } from 'zustand'
import { ClapOutputType, ClapSegmentCategory } from '@aitube/clap'
import {
  BufferedSegments,
  RendererStore,
  RenderingStrategies,
} from '@aitube/clapper-services'
import {
  TimelineStore,
  useTimeline,
  TimelineSegment,
  RenderingStrategy,
} from '@aitube/timeline'

import { getDefaultRendererState } from './getDefaultRendererState'
import { getSegmentCacheKey } from './getSegmentCacheKey'
import { getDefaultBufferedSegments } from './getDefaultBufferedSegments'
import { useMonitor } from '../monitor/useMonitor'
import { useSettings } from '../settings'

export const useRenderer = create<RendererStore>((set, get) => ({
  ...getDefaultRendererState(),

  clear: () => {
    set({
      ...getDefaultRendererState(),
    })
  },

  setUserDefinedRenderingStrategies: ({
    imageRenderingStrategy: userDefinedImageRenderingStrategy,
    videoRenderingStrategy: userDefinedVideoRenderingStrategy,
    soundRenderingStrategy: userDefinedSoundRenderingStrategy,
    voiceRenderingStrategy: userDefinedVoiceRenderingStrategy,
    musicRenderingStrategy: userDefinedMusicRenderingStrategy,
  }: RenderingStrategies) => {
    // if the monitor is embedded, the imageRenderingStrategy is temporary bypassed
    // to try to render all the segments in advance, to create a buffer
    // this is a potentially expensive solution, so we might want to put
    // some limits to that ex. the first 64 or something
    const { isEmbedded } = useMonitor.getState()

    // What we are doing here is that when we are in "embedded" video player mode,
    // we bypass the image rendering strategy to render all the segments in advance
    const imageRenderingStrategy = isEmbedded
      ? RenderingStrategy.BUFFERED_PLAYBACK_STREAMING
      : userDefinedImageRenderingStrategy
    const videoRenderingStrategy =
      /* isEmbedded ? RenderingStrategy.ON_SCREEN_THEN_ALL : */ userDefinedVideoRenderingStrategy
    const soundRenderingStrategy =
      /* isEmbedded ? RenderingStrategy.ON_SCREEN_THEN_ALL : */ userDefinedSoundRenderingStrategy
    const voiceRenderingStrategy =
      /* isEmbedded ? RenderingStrategy.ON_SCREEN_THEN_ALL : */ userDefinedVoiceRenderingStrategy
    const musicRenderingStrategy =
      /* isEmbedded ? RenderingStrategy.ON_SCREEN_THEN_ALL : */ userDefinedMusicRenderingStrategy

    set({
      imageRenderingStrategy,
      videoRenderingStrategy,
      soundRenderingStrategy,
      voiceRenderingStrategy,
      musicRenderingStrategy,
    })
  },

  // this will be called at 60 FPS - and yes, it is expensive
  // we could probably improve things by using a temporal tree index
  renderLoop: (jumpedSomewhere?: boolean): BufferedSegments => {
    const {
      computeBufferedSegments,
      bufferedSegments,
      dataUriBuffer1: previousDataUriBuffer1,
      dataUriBuffer2: previousDataUriBuffer2,
      dataUriBuffer1Key: previousDataUriBuffer1Key,
      dataUriBuffer2Key: previousDataUriBuffer2Key,
      activeBufferNumber: previousActiveBufferNumber,
    } = get()

    // note: although useRequestAnimationFrame is called at 60 FPS,
    // computeBufferedSegments has a throttle since it is expensive
    const maybeNewBufferedSegments = computeBufferedSegments()

    const activeSegmentsChanged =
      maybeNewBufferedSegments.activeSegmentsCacheKey !==
      bufferedSegments.activeSegmentsCacheKey
    const upcomingSegmentsChanged =
      maybeNewBufferedSegments.upcomingSegmentsCacheKey !==
      bufferedSegments.upcomingSegmentsCacheKey

    if (activeSegmentsChanged || upcomingSegmentsChanged) {
      const maybeNewCurrentSegment = maybeNewBufferedSegments.activeVideoSegment
        ?.assetUrl
        ? maybeNewBufferedSegments.activeVideoSegment
        : maybeNewBufferedSegments.activeStoryboardSegment?.assetUrl
          ? maybeNewBufferedSegments.activeStoryboardSegment
          : undefined

      // the upcoming asset we want to preload (note: we just want to preload it, not display it just yet)
      const maybeNewPreloadSegment = maybeNewBufferedSegments
        .upcomingVideoSegment?.assetUrl
        ? maybeNewBufferedSegments.upcomingVideoSegment
        : maybeNewBufferedSegments.upcomingStoryboardSegment?.assetUrl
          ? maybeNewBufferedSegments.upcomingStoryboardSegment
          : undefined

      // performance optimization:
      // we only look at the first part since it might be huge
      // for assets, using a smaller header lookup like 256 or even 512 doesn't seem to be enough
      const newCurrentSegmentKey =
        `${maybeNewCurrentSegment?.assetUrl || ''}`.slice(0, 1024)
      const newPreloadSegmentKey =
        `${maybeNewPreloadSegment?.assetUrl || ''}`.slice(0, 1024)

      let newDataUriBuffer1 = previousDataUriBuffer1
      let newDataUriBuffer2 = previousDataUriBuffer2
      let newDataUriBuffer1Key = `${newDataUriBuffer1?.assetUrl || ''}`.slice(
        0,
        1024
      )
      let newDataUriBuffer2Key = `${newDataUriBuffer2?.assetUrl || ''}`.slice(
        0,
        1024
      )

      if (jumpedSomewhere) {
        // if we jumped somewhere we need to change the visible buffer
        if (previousActiveBufferNumber == 2) {
          // visible buffer is #2

          if (newCurrentSegmentKey !== previousDataUriBuffer2Key) {
            // we thus write to visible buffer (#1)
            newDataUriBuffer1 = maybeNewCurrentSegment
            newDataUriBuffer1Key =
              `${maybeNewCurrentSegment?.assetUrl || ''}`.slice(0, 1024)
          }
        } else {
          // visible buffer is #1
          if (newCurrentSegmentKey !== previousDataUriBuffer1Key) {
            // we thus write to visible buffer (#2)
            newDataUriBuffer2 = maybeNewCurrentSegment
            newDataUriBuffer2Key =
              `${maybeNewCurrentSegment?.assetUrl || ''}`.slice(0, 1024)
          }
        }
      }

      // otherwise we do the predictive stuff as usual
      set({
        bufferedSegments: maybeNewBufferedSegments,
        currentSegment: maybeNewCurrentSegment,
        preloadSegment: maybeNewPreloadSegment,
        currentSegmentKey: newCurrentSegmentKey,
        preloadSegmentKey: newPreloadSegmentKey,
        dataUriBuffer1Key: newDataUriBuffer1Key,
        dataUriBuffer2Key: newDataUriBuffer2Key,
        dataUriBuffer1: newDataUriBuffer1,
        dataUriBuffer2: newDataUriBuffer2,
      })

      return maybeNewBufferedSegments
    }

    return bufferedSegments
  },

  computeBufferedSegments: (): BufferedSegments => {
    const timelineState: TimelineStore = useTimeline.getState()
    const { cursorTimestampAtInMs, segments: clapSegments } = timelineState
    const segments = clapSegments as TimelineSegment[]

    const results: BufferedSegments = getDefaultBufferedSegments()

    // we could use a temporal index to keep things efficient here
    // thiere is this relatively recent algorithm, the IB+ Tree,
    // which seems to be good for what we want to do
    // https://www.npmjs.com/package/i2bplustree
    // another solution could be to filter the segments into multiple arrays by category,
    // although we will have to see when those segments are re-computed / synced
    for (const segment of segments) {
      const inActiveShot =
        segment.startTimeInMs <= cursorTimestampAtInMs &&
        cursorTimestampAtInMs < segment.endTimeInMs

      if (inActiveShot) {
        const isActiveVideo =
          segment.category === ClapSegmentCategory.VIDEO && segment.assetUrl
        if (isActiveVideo) {
          results.activeSegments.push(segment)
          results.activeVideoSegment = segment
          results.activeSegmentsCacheKey = getSegmentCacheKey(
            segment,
            results.activeSegmentsCacheKey
          )
          continue
        }

        const isActiveAudio =
          // IF this is an audio segment
          segment.outputType === ClapOutputType.AUDIO &&
          // AND there is an actual audio buffer attached to it
          segment.audioBuffer

        if (isActiveAudio) {
          results.activeSegments.push(segment)
          results.activeAudioSegments.push(segment)
          results.activeSegmentsCacheKey = getSegmentCacheKey(
            segment,
            results.activeSegmentsCacheKey
          )
          continue
        }

        const isActiveStoryboard =
          segment.category === ClapSegmentCategory.IMAGE && segment.assetUrl
        if (isActiveStoryboard) {
          results.activeSegments.push(segment)
          results.activeStoryboardSegment = segment
          results.activeSegmentsCacheKey = getSegmentCacheKey(
            segment,
            results.activeSegmentsCacheKey
          )
          continue
        }

        results.activeSegments.push(segment)
        results.activeSegmentsCacheKey = getSegmentCacheKey(
          segment,
          results.activeSegmentsCacheKey
        )
        continue
      }

      const existingVideoShot: TimelineSegment | undefined =
        results.upcomingVideoSegment

      const isUpcoming = segment.startTimeInMs > cursorTimestampAtInMs
      if (isUpcoming) {
        // for the "upcoming" video we need to find the closest one
        // in terms of distance with the current cursor position

        // otherwise we populare the upcoming segments,
        // if we find the closests candidates
        const isVideo =
          segment.category === ClapSegmentCategory.VIDEO && segment.assetUrl
        // const isUpcomingStoryboardImage = segment.category === ClapSegmentCategory.IMAGE && segment.assetUrl
        if (isVideo) {
          // if the candidate isn't "more upcoming" than the current result,
          // then we continue
          if (
            existingVideoShot &&
            existingVideoShot.startTimeInMs < segment.startTimeInMs
          ) {
            continue
          }
          results.upcomingVideoSegment = segment
          continue
        }

        const isStoryboardImage =
          segment.category === ClapSegmentCategory.IMAGE && segment.assetUrl
        if (isStoryboardImage && !results.upcomingStoryboardSegment) {
          results.upcomingStoryboardSegment = segment
          continue
        }
      }
    }

    results.upcomingSegments = []
    results.upcomingSegmentsCacheKey = ''
    if (results.upcomingVideoSegment) {
      results.upcomingSegments.push(results.upcomingVideoSegment)
      results.upcomingSegmentsCacheKey = getSegmentCacheKey(
        results.upcomingVideoSegment,
        ''
      )
    }

    if (results.upcomingStoryboardSegment) {
      results.upcomingSegments.push(results.upcomingStoryboardSegment)
      results.upcomingSegmentsCacheKey = getSegmentCacheKey(
        results.upcomingStoryboardSegment,
        results.upcomingSegmentsCacheKey
      )
    }

    return results
  },

  setDataUriBuffer1: (dataUriBuffer1?: TimelineSegment) => {
    set({ dataUriBuffer1 })
  },
  setDataUriBuffer2: (dataUriBuffer2?: TimelineSegment) => {
    set({ dataUriBuffer2 })
  },
  setActiveBufferNumber: (activeBufferNumber: number) => {
    set({ activeBufferNumber })
  },

  syncVideoToCurrentCursorPosition: () => {
    const {
      dataUriBuffer1,
      dataUriBuffer2,
      dataUriBuffer1Key,
      dataUriBuffer2Key,
      activeBufferNumber,
    } = get()
    const timeline: TimelineStore = useTimeline.getState()

    const activeSegment =
      activeBufferNumber === 1 ? dataUriBuffer1 : dataUriBuffer2

    if (!activeSegment) {
      return
    }

    const elements = document.getElementsByTagName('video')

    const visibleVideoElements = Array.from(elements).filter((element) =>
      Array.from(element.classList).includes('opacity-100')
    )

    const segmentDurationInMs =
      activeSegment.endTimeInMs - activeSegment.startTimeInMs

    const actualDurationInMs = Math.min(
      segmentDurationInMs,
      activeSegment.assetDurationInMs
    )

    // how much advanced into the video we should be
    const deltaTimeInMs =
      timeline.cursorTimestampAtInMs - activeSegment.startTimeInMs

    let progressTimeWithinVideoInMs = 0
    if (deltaTimeInMs < 0) {
      progressTimeWithinVideoInMs = 0
    } else if (deltaTimeInMs > actualDurationInMs) {
      progressTimeWithinVideoInMs = actualDurationInMs
    } else {
      progressTimeWithinVideoInMs = deltaTimeInMs
    }

    for (const videoElement of visibleVideoElements) {
      const currentTimeInMs = videoElement.currentTime * 1000

      const diffInMs = Math.abs(currentTimeInMs - progressTimeWithinVideoInMs)

      // console.log(`diffInMs = ${diffInMs}; deltaTimeInMs = ${deltaTimeInMs}; currentTime = ${visibleVideoElements[0].currentTime * 1000};`)

      // we let the native video player controls the playback as much as possible
      // normally we should be in sync, more or less 50ms
      // but to be safe, we only kick-in the sync if we observe a discrepancy > 100ms
      if (diffInMs > 100) {
        //  need to be converted to seconds
        videoElement.currentTime = progressTimeWithinVideoInMs / 1000
      }
    }
  },
}))
