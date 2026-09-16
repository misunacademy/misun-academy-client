"use client"

import { IContentBlock } from '@/types/quiz'
import Image from 'next/image'

interface ContentBlockDisplayProps {
    content: IContentBlock
    className?: string
    variant?: 'default' | 'question'
}

export function ContentBlockDisplay({ content, className = '', variant = 'default' }: ContentBlockDisplayProps) {
    if (!content) return null

    return (
        <div className={`space-y-2 ${className}`}>
            {(content.type === 'text' || content.type === 'text_image') && content.text && (
                <p className={variant === 'question' ? 'text-base font-semibold leading-relaxed text-white' : 'text-sm leading-relaxed text-white'}>{content.text}</p>
            )}
            {(content.type === 'image' || content.type === 'text_image') && content.imageUrl && (
                <div className="relative overflow-hidden rounded-lg">
                    <Image
                        src={content.imageUrl}
                        alt={content.altText || 'Image'}
                        width={400}
                        height={300}
                        className="object-cover w-full h-auto max-h-64"
                    />
                </div>
            )}
        </div>
    )
}
