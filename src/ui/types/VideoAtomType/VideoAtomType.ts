import { Media } from '@payload-types'
import { VariantProps } from 'class-variance-authority'
import { variantsVideo } from '@atoms'

export interface VideoAtomType {
  video: Media
  autoPlay?: boolean
  variant?: VariantProps<typeof variantsVideo>['variant']
}
