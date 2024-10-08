import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'

import { genericImage, genericPrompt } from '../common/defaultValues'
import { text_to_image_demo_workflow } from '../common/comfyui/text_to_image_demo_workflow'
import { useSettings } from '@/services'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const comfyuiWorkflows: ClapWorkflow[] = [
  {
    id: 'comfyui://text_to_image_demo_workflow',
    label: "WIP DEMO (DOESN'T WORK)",
    description: '',
    tags: [],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
    provider: ClapWorkflowProvider.COMFYUI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: JSON.stringify(text_to_image_demo_workflow),
    schema: '',
    inputFields: [genericPrompt],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
    },
  },
]

// this define dynamic comfyui workflow
//
// a dynamic workflow can come from a 3rd party website, a database,
// the local storage
//
// note: we should be careful because there is a 10 Mb for the local storage,
// I think.
// so users should not put too much stuff in here
export async function getDynamicComfyuiWorkflows(): Promise<ClapWorkflow[]> {
  const settings = useSettings.getState()

  const workflows: ClapWorkflow[] = [
    {
      id: 'comfyui://settings.comfyWorkflowForImage',
      label: 'Custom Image Workflow',
      description: 'Custom ComfyUI workflow to generate images',
      tags: ['custom', 'image generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.IMAGE_GENERATION,
      data: settings.comfyClapWorkflowForImage?.data,
      schema: '',
      inputFields: settings.comfyClapWorkflowForImage?.inputFields || [
        genericPrompt,
      ],
      inputValues: settings.comfyClapWorkflowForImage?.inputValues || {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForVideo',
      label: 'Custom Video Workflow',
      description: 'Custom ComfyUI workflow to generate videos',
      tags: ['custom', 'video generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.VIDEO_GENERATION,
      data: settings.comfyClapWorkflowForVideo.data,
      schema: '',
      inputFields: settings.comfyClapWorkflowForVideo.inputFields || [
        genericImage,
      ],
      inputValues: settings.comfyClapWorkflowForVideo.inputValues || {
        [genericImage.id]: genericImage.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForVoice',
      label: 'Custom Voice Workflow',
      description: 'Custom ComfyUI workflow to generate voice',
      tags: ['custom', 'voice generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.VOICE_GENERATION,
      data: settings.comfyWorkflowForVoice,
      schema: '',
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForMusic',
      label: 'Custom Music Workflow',
      description: 'Custom ComfyUI workflow to generate music',
      tags: ['custom', 'music generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.MUSIC_GENERATION,
      data: settings.comfyWorkflowForMusic,
      schema: '',
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
    {
      id: 'comfyui://settings.comfyWorkflowForSound',
      label: 'Custom Sound Workflow',
      description: 'Custom ComfyUI workflow to generate sound',
      tags: ['custom', 'sound generation'],
      author: 'You',
      thumbnailUrl: '',
      nonCommercial: false,
      engine: ClapWorkflowEngine.COMFYUI_WORKFLOW,
      provider: ClapWorkflowProvider.COMFYUI,
      category: ClapWorkflowCategory.SOUND_GENERATION,
      data: settings.comfyWorkflowForSound,
      schema: '',
      inputFields: [genericPrompt],
      inputValues: {
        [genericPrompt.id]: genericPrompt.defaultValue,
      },
    },
  ]

  return workflows
}
