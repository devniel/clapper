import { useTimeline } from '@aitube/timeline'
import { useTasks } from '@/components/tasks/useTasks'
import { useAssistant } from './assistant/useAssistant'
import { useMic } from './mic/useMic'
import { useAudio } from './audio/useAudio'
import { useBroadcast } from './broadcast/useBroadcast'
import {
  useEditors,
  useEntityEditor,
  useFilterEditor,
  useProjectEditor,
  useScriptEditor,
  useSegmentEditor,
  useWorkflowEditor,
} from './editors'
import { useIO } from './io/useIO'
import { useMetrics } from './metrics/useMetrics'
import { useMonitor } from './monitor/useMonitor'
import { useRenderer } from './renderer/useRenderer'
import { useResolver } from './resolver/useResolver'
import { useSettings } from './settings/useSettings'
import { useSimulator } from './simulator/useSimulator'
import { useUI } from './ui/useUI'
import { useWindows } from './windows/useWindows'

// those are just used for developer convenience
// to help debug things in the chrome developer console

if (typeof window !== 'undefined') {
  const w = window as any
  w.useTasks = useTasks
  w.useAssistant = useAssistant
  w.useMic = useMic
  w.useAudio = useAudio
  w.useBroadcast = useBroadcast

  // I think we have a cyclic dependency somewhere,
  // because uncommenting the following lines will crash the app
  // w.useEditors = useEditors
  // w.useWorkflowEditor = useWorkflowEditor
  // w.useIO = useIO
  // w.useSettings = useSettings

  w.useEntityEditor = useEntityEditor
  w.useFilterEditor = useFilterEditor
  w.useProjectEditor = useProjectEditor
  w.useScriptEditor = useScriptEditor
  w.useSegmentEditor = useSegmentEditor
  w.useMetrics = useMetrics
  w.useMonitor = useMonitor
  w.useRenderer = useRenderer
  w.useResolver = useResolver
  w.useSimulator = useSimulator
  w.useUI = useUI
  w.useWindows = useWindows
  w.useTimeine = useTimeline
}
