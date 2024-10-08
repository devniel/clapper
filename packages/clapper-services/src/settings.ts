import { ClapWorkflow, ClapWorkflowProvider } from "@aitube/clap"
import { RenderingStrategy } from "@aitube/timeline"

import { ComfyIcuAccelerator } from "./base-types"

export type BaseSettings = {
  comfyUiClientId: string
  comfyUiHttpAuthLogin: string
  comfyUiHttpAuthPassword: string
  replicateApiKey: string
  comfyIcuApiKey: string
  comfyIcuAccelerator: ComfyIcuAccelerator
  comfyDeployApiKey: string
  aiTubeApiKey: string
  falAiApiKey: string
  modelsLabApiKey: string
  huggingFaceApiKey: string
  openaiApiKey: string
  googleApiKey: string
  groqApiKey: string
  anthropicApiKey: string
  elevenLabsApiKey: string
  kitsAiApiKey: string
  cohereApiKey: string
  mistralAiApiKey: string
  stabilityAiApiKey: string
  fireworksAiApiKey: string
  letzAiApiKey: string
  bigModelApiKey: string
  piApiApiKey: string
  civitaiApiKey: string
  hotshotApiKey: string

  broadcastObsServerHost: string
  broadcastObsServerPort: number
  broadcastObsServerPass: string

  // -------------- SAFETY CHECKER ------------------

  censorNotForAllAudiencesContent: boolean

  // -------------- MISC SETTINGS -------------------

  imagePromptPrefix: string
  imagePromptSuffix: string
  imageNegativePrompt: string
  videoPromptPrefix: string
  videoPromptSuffix: string
  videoNegativePrompt: string

  imageRenderingStrategy: RenderingStrategy
  imageUpscalingRenderingStrategy: RenderingStrategy
  imageDepthRenderingStrategy: RenderingStrategy
  imageSegmentationRenderingStrategy: RenderingStrategy
  videoRenderingStrategy: RenderingStrategy
  videoUpscalingRenderingStrategy: RenderingStrategy
  videoDepthRenderingStrategy: RenderingStrategy
  videoSegmentationRenderingStrategy: RenderingStrategy
  voiceRenderingStrategy: RenderingStrategy
  soundRenderingStrategy: RenderingStrategy
  musicRenderingStrategy: RenderingStrategy

  maxImagesToGenerateInParallel: number
  maxVideosToGenerateInParallel: number

  // ------------ COMFY UI CLAP WORKFLOWS -----------------
  comfyClapWorkflowForImage: ClapWorkflow
  comfyClapWorkflowForVideo: ClapWorkflow
  comfyWorkflowForVoice: string
  comfyWorkflowForSound: string
  comfyWorkflowForMusic: string

  // ------------ OTHER SETTINGS -----------

  comfyUiApiUrl: string

  gradioApiUrlForAssistant: string
  gradioApiUrlForImage: string
  gradioApiUrlForVideo: string
  gradioApiUrlForVoice: string
  gradioApiUrlForSound: string
  gradioApiUrlForMusic: string

  scriptEditorShowLineNumbers: boolean
  scriptEditorShowMinimap: boolean
}

// Settings are serialized to the local storage,
// and we want to keep them lightweight
export type SettingsState = BaseSettings & {
  assistantWorkflow: string
  assistantTurboWorkflow: string
  imageGenerationWorkflow: string
  imageGenerationTurboWorkflow: string
  imageFaceswapWorkflow: string
  imageUpscalingWorkflow: string
  imageDepthWorkflow: string
  imageSegmentationWorkflow: string
  videoGenerationWorkflow: string
  videoFaceswapWorkflow: string
  videoLipsyncWorkflow: string
  videoUpscalingWorkflow: string
  videoDepthWorkflow: string
  videoSegmentationWorkflow: string
  soundGenerationWorkflow: string
  voiceGenerationWorkflow: string
  musicGenerationWorkflow: string
}

// those settings are used for requests to the AI Assistant,
// or to resolve segments
export type RequestSettings = BaseSettings & {
  assistantWorkflow: ClapWorkflow
  assistantTurboWorkflow: ClapWorkflow
  imageGenerationWorkflow: ClapWorkflow
  imageGenerationTurboWorkflow: ClapWorkflow
  imageFaceswapWorkflow: ClapWorkflow
  imageUpscalingWorkflow: ClapWorkflow
  imageDepthWorkflow: ClapWorkflow
  imageSegmentationWorkflow: ClapWorkflow
  videoGenerationWorkflow: ClapWorkflow
  videoFaceswapWorkflow: ClapWorkflow
  videoLipsyncWorkflow: ClapWorkflow
  videoUpscalingWorkflow: ClapWorkflow
  videoDepthWorkflow: ClapWorkflow
  videoSegmentationWorkflow: ClapWorkflow
  soundGenerationWorkflow: ClapWorkflow
  voiceGenerationWorkflow: ClapWorkflow
  musicGenerationWorkflow: ClapWorkflow
}

export type SettingsControls = {
  setComfyUiClientId: (comfyUiClientId?: string) => void
  setComfyUiHttpAuthLogin: (comfyUiHttpAuthLogin?: string) => void
  setComfyUiHttpAuthPassword: (comfyUiHttpAuthPassword?: string) => void
  setReplicateApiKey: (replicateApiKey?: string) => void
  setComfyIcuApiKey: (comfyIcuApiKey?: string) => void
  setComfyIcuAccelerator: (comfyIcuAccelerator?: ComfyIcuAccelerator) => void
  setComfyDeployApiKey: (comfyDeployApiKey?: string) => void
  setHuggingFaceApiKey: (huggingFaceApiKey?: string) => void
  setModelsLabApiKey: (modelsLabApiKey?: string) => void
  setAiTubeApiKey: (aiTubeApiKey?: string) => void
  setFalAiApiKey: (falAiApiKey?: string) => void
  setOpenaiApiKey: (openaiApiKey?: string) => void
  setGoogleApiKey: (googleApiKey?: string) => void
  setGroqApiKey: (groqApiKey?: string) => void
  setFireworksAiApiKey: (fireworksAiApiKey?: string) => void
  setAnthropicApiKey: (anthropicApiKey?: string) => void
  setElevenLabsApiKey: (elevenLabsApiKey?: string) => void
  setCohereApiKey: (cohereApiKey?: string) => void
  setMistralAiApiKey: (mistralAiApiKey?: string) => void
  setKitsAiApiKey: (kitsAiApiKey?: string) => void
  setStabilityAiApiKey: (stabilityAiApiKey?: string) => void
  setLetzAiApiKey: (letzAiApiKey?: string) =>  void
  setBigModelApiKey: (bigModelApiKey?: string) =>  void
  setPiApiApiKey: (piApiApiKey?: string) =>  void
  setCivitaiApiKey: (civitaiApiKey?: string) =>  void
  setHotshotApiKey: (hotshotApiKey?: string) =>  void

  setCensorNotForAllAudiencesContent: (censorNotForAllAudiencesContent?: boolean) => void
  setImagePromptPrefix: (imagePromptPrefix?: string) => void
  setImagePromptSuffix: (imagePromptSuffix?: string) => void
  setImageNegativePrompt: (imageNegativePrompt?: string) => void
  setVideoPromptPrefix: (videoPromptPrefix?: string) => void
  setVideoPromptSuffix: (videoPromptSuffix?: string) => void
  setVideoNegativePrompt: (videoNegativePrompt?: string) => void

  setAssistantWorkflow: (assistantWorkflow?: ClapWorkflow) => void
  setAssistantTurboWorkflow: (assistantTurboWorkflow?: ClapWorkflow) => void
  setImageGenerationWorkflow: (imageGenerationWorkflow?: ClapWorkflow) => void
  setImageGenerationTurboWorkflow: (imageGenerationTurboWorkflow?: ClapWorkflow) => void
  setImageFaceswapWorkflow: (imageFaceswapWorkflow?: ClapWorkflow) => void
  setImageUpscalingWorkflow: (imageUpscalingWorkflow?: ClapWorkflow) => void
  setImageDepthWorkflow: (imageDepthWorkflow?: ClapWorkflow) => void
  setImageSegmentationWorkflow: (imageSegmentationWorkflow?: ClapWorkflow) => void
  setVideoGenerationWorkflow: (videoGenerationWorkflow?: ClapWorkflow) => void
  setVideoFaceswapWorkflow: (videoFaceswapWorkflow?: ClapWorkflow) => void
  setVideoLipsyncWorkflow: (videoLipsyncWorkflow?: ClapWorkflow) => void
  setVideoDepthWorkflow: (videoDepthWorkflow?: ClapWorkflow) => void
  setVideoSegmentationWorkflow: (videoSegmentationWorkflow?: ClapWorkflow) => void
  setVideoUpscalingWorkflow: (videoUpscalingWorkflow?: ClapWorkflow) => void
  setSoundGenerationWorkflow: (soundGenerationWorkflow?: ClapWorkflow) => void
  setVoiceGenerationWorkflow: (voiceGenerationWorkflow?: ClapWorkflow) => void
  setMusicGenerationWorkflow: (musicGenerationWorkflow?: ClapWorkflow) => void
  
  setImageRenderingStrategy: (imageRenderingStrategy?: RenderingStrategy) => void
  setImageUpscalingRenderingStrategy: (imageUpscalingRenderingStrategy?: RenderingStrategy) => void
  setImageDepthRenderingStrategy: (imageDepthRenderingStrategy?: RenderingStrategy) => void
  setImageSegmentationRenderingStrategy: (imageSegmentationRenderingStrategy?: RenderingStrategy) => void
  setVideoRenderingStrategy: (videoRenderingStrategy?: RenderingStrategy) => void
  setVideoDepthRenderingStrategy: (videoDepthRenderingStrategy?: RenderingStrategy) => void
  setVideoSegmentationRenderingStrategy: (videoSegmentationRenderingStrategy?: RenderingStrategy) => void
  setVideoUpscalingRenderingStrategy: (videoUpscalingRenderingStrategy?: RenderingStrategy) => void
  setVoiceRenderingStrategy: (voiceRenderingStrategy?: RenderingStrategy) => void
  setSoundRenderingStrategy: (soundRenderingStrategy?: RenderingStrategy) => void
  setMusicRenderingStrategy: (musicRenderingStrategy?: RenderingStrategy) => void


  setMaxImagesToGenerateInParallel: (maxImagesToGenerateInParallel?: number) => void
  setMaxVideosToGenerateInParallel: (maxVideosToGenerateInParallel?: number) => void

  setComfyClapWorkflowForImage: (comfyClapWorkflowForImage?: ClapWorkflow) => void
  setComfyClapWorkflowForVideo: (comfyClapWorkflowForVideo?: ClapWorkflow) => void
  setComfyWorkflowForVoice: (comfyWorkflowForVoice?: string) => void
  setComfyWorkflowForSound: (comfyWorkflowForSound?: string) => void
  setComfyWorkflowForMusic: (comfyWorkflowForMusic?: string) => void

  setComfyUiApiUrl: (comfyUiApiUrl?: string) => void

  setGradioApiUrlForAssistant: (gradioApiUrlForAssistant?: string) => void
  setGradioApiUrlForImage: (gradioApiUrlForImage?: string) => void
  setGradioApiUrlForVideo: (gradioApiUrlForVideo?: string) => void
  setGradioApiUrlForVoice: (gradioApiUrlForVoice?: string) => void
  setGradioApiUrlForSound: (gradioApiUrlForSound?: string) => void
  setGradioApiUrlForMusic: (gradioApiUrlForMusic?: string) => void

  setScriptEditorShowLineNumbers: (scriptEditorShowLineNumbers: boolean) => void
  setScriptEditorShowMinimap: (scriptEditorShowMinimap: boolean) => void

  /**
   * Return settings that can be used for a request
   * 
   * @returns
   */
  getRequestSettings: () => RequestSettings
}

export type SettingsStore =
  SettingsState &
  SettingsControls