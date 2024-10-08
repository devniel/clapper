import {
  ClapWorkflow,
  ClapWorkflowCategory,
  ClapWorkflowEngine,
  ClapWorkflowProvider,
} from '@aitube/clap'
import {
  genericHeight1024,
  genericPrompt,
  genericWidth1024,
} from '../common/defaultValues'

// ------------------------------------------------------------------------------
// if a user is already using one of those workflows and you change its settings,
// they will have to reselect it in the UI for changes to be taken into account.
//
// -> we can create a ticket to fix this
// ------------------------------------------------------------------------------
export const letzAiWorkflows: ClapWorkflow[] = [
  {
    id: 'letzai://api/images',
    label: 'Create image with LetzAI',
    description: '',
    tags: ['image'],
    author: '',
    thumbnailUrl: '',
    nonCommercial: false,
    engine: ClapWorkflowEngine.REST_API,
    provider: ClapWorkflowProvider.LETZAI,
    category: ClapWorkflowCategory.IMAGE_GENERATION,
    data: 'api/images', // <- this value isn't really used, it's just to put something here
    schema: '',
    inputFields: [genericPrompt, genericWidth1024, genericHeight1024],
    inputValues: {
      [genericPrompt.id]: genericPrompt.defaultValue,
      [genericWidth1024.id]: genericWidth1024.defaultValue,
      [genericHeight1024.id]: genericHeight1024.defaultValue,
    },
  },
]
