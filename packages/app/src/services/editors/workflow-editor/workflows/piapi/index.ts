import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import { genericImageUrl, genericPrompt } from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const piApiWorkflows: ClapWorkflow[] = [
  {
    id: 'piapi://mj/v2/imagine',
    label: 'Midjourney Imagine',
    description: '',
    tags: ['Midjourney'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.PIAPI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'mj/v2/imagine', // <- this value isn't really used, it's just to put something here
    schema: '',
    inputFields: [
      genericPrompt,
      // genericRatio
      //genericWidth1024,
      //genericHeight1024,
    ],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      // genericRatio
      //[genericWidth1024.id]: genericWidth1024.defaultValue,
      //[genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
  {
    id: 'piapi://luma/v1/video',
    label: 'Luma Labs Dream Machine',
    description: '',
    tags: ['Dream Machine'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.PIAPI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'luma/v1/video',
    schema: '',
    inputFields: [
      genericImageUrl,
      // genericRatio
      //genericWidth1024,
      //genericHeight1024,
    ],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
      // genericRatio
      //[genericWidth1024.id]: genericWidth1024.defaultValue,
      //[genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
  {
    id: 'piapi://kling/v1/video',
    label: 'Kling',
    description: '',
    tags: ['Kling'],
    author: 'Kling',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.PIAPI,
    category: ClapWorkflowCategory.VIDEO_GENERATION,
    data: 'kling/v1/video',
    schema: '',
    inputFields: [
      genericImageUrl,
      // genericRatio
      //genericWidth1024,
      //genericHeight1024,
    ],
    inputValues: {
      [genericImageUrl.id]: genericImageUrl.defaultValue,
      // genericRatio
      //[genericWidth1024.id]: genericWidth1024.defaultValue,
      //[genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
]
