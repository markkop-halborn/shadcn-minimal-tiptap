import { Image as TiptapImage } from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { ImageViewBlock } from './components/image-view-block'
import { filterFiles, sanitizeUrl } from '../../utils'

const handleError = (error, props, errorHandler) => {
  const typedError = error instanceof Error ? error : new Error('Unknown error')
  errorHandler?.(typedError, props)
}

const handleDataUrl = (src) => {
  const [header, base64Data] = src.split(',')
  const mimeType = header.split(':')[1].split(';')[0]
  const extension = mimeType.split('/')[1]
  const byteCharacters = atob(base64Data)
  const byteArray = new Uint8Array(byteCharacters.length)
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i)
  }
  const blob = new Blob([byteArray], { type: mimeType })
  return { blob, extension }
}

const handleImageUrl = async (src) => {
  const response = await fetch(src)
  if (!response.ok) throw new Error('Failed to fetch image')
  const blob = await response.blob()
  const extension = blob.type.split(/\/|\+/)[1]
  return { blob, extension }
}

const fetchImageBlob = async (src) => {
  if (src.startsWith('data:')) {
    return handleDataUrl(src)
  } else {
    return handleImageUrl(src)
  }
}

const saveImage = async (blob, name, extension) => {
  const imageURL = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = imageURL
  link.download = `${name}.${extension}`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(imageURL)
}

const defaultDownloadImage = async (props, options) => {
  const { src, alt } = props
  const potentialName = alt || 'image'

  try {
    const { blob, extension } = await fetchImageBlob(src)
    await saveImage(blob, potentialName, extension)
    options.onActionSuccess?.({ ...props, action: 'download' })
  } catch (error) {
    handleError(error, { ...props, action: 'download' }, options.onActionError)
  }
}

const defaultCopyImage = async (props, options) => {
  const { src } = props
  try {
    const res = await fetch(src)
    const blob = await res.blob()
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    options.onActionSuccess?.({ ...props, action: 'copyImage' })
  } catch (error) {
    handleError(error, { ...props, action: 'copyImage' }, options.onActionError)
  }
}

const defaultCopyLink = async (props, options) => {
  const { src } = props
  try {
    await navigator.clipboard.writeText(src)
    options.onActionSuccess?.({ ...props, action: 'copyLink' })
  } catch (error) {
    handleError(error, { ...props, action: 'copyLink' }, options.onActionError)
  }
}

export const Image = TiptapImage.extend({
  atom: true,

  addOptions() {
    return {
      ...this.parent?.(),
      allowedMimeTypes: [],
      maxFileSize: 0,
      uploadFn: undefined
    }
  },

  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: undefined
      },
      height: {
        default: undefined
      }
    }
  },

  addCommands() {
    return {
      setImages:
        attrs =>
        ({ commands }) => {
          const [validImages, errors] = filterFiles(attrs, {
            allowedMimeTypes: this.options.allowedMimeTypes,
            maxFileSize: this.options.maxFileSize,
            allowBase64: this.options.allowBase64
          })

          if (errors.length > 0 && this.options.onValidationError) {
            this.options.onValidationError(errors)
          }

          if (validImages.length > 0) {
            return commands.insertContent(
              validImages.map(image => {
                return {
                  type: this.type.name,
                  attrs: {
                    src:
                      image.src instanceof File
                        ? sanitizeUrl(URL.createObjectURL(image.src), {
                            allowBase64: this.options.allowBase64
                          })
                        : image.src,
                    alt: image.alt,
                    title: image.title
                  }
                }
              })
            )
          }

          return false
        },
      downloadImage: attrs => () => {
        const downloadFunc = this.options.customDownloadImage || defaultDownloadImage
        void downloadFunc({ ...attrs, action: 'download' }, this.options)
        return true
      },
      copyImage: attrs => () => {
        const copyImageFunc = this.options.customCopyImage || defaultCopyImage
        void copyImageFunc({ ...attrs, action: 'copyImage' }, this.options)
        return true
      },
      copyLink: attrs => () => {
        const copyLinkFunc = this.options.customCopyLink || defaultCopyLink
        void copyLinkFunc({ ...attrs, action: 'copyLink' }, this.options)
        return true
      }
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageViewBlock, {
      className: 'block-node'
    })
  }
})
