"use client"

import type { DocumentFormProps } from "./document-form.props"
import TitleInput from "./title-input/title-input"
import SlugInput from "./slug-input/slug-input"
import DescriptionInput from "./description-input/description-input"
import TagsInput from "./tags-input/tags-input"
import ContentEditor from "./content-editor/content-editor"

export default function DocumentForm({ control }: DocumentFormProps) {
  return (
    <>
      <TitleInput control={control} />

      <SlugInput control={control} />

      <DescriptionInput control={control} />

      <TagsInput control={control} />

      <ContentEditor control={control} />
    </>
  )
}
