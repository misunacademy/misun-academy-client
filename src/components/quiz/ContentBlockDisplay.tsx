"use client"

import { IContentBlock } from '@/types/quiz'
import Image from 'next/image'

interface ContentBlockDisplayProps {
    content: IContentBlock
    className?: string
    variant?: 'default' | 'question'
    /**
     * Surface tone the text sits on. The classroom player is always dark
     * (white text); the admin/instructor dashboards are light, where white
     * text would be invisible — pass tone="light" there.
     */
    tone?: 'dark' | 'light'
}

export function ContentBlockDisplay({ content, className = '', variant = 'default', tone = 'dark' }: ContentBlockDisplayProps) {
    if (!content) return null

    const textColor = tone === 'light' ? 'text-foreground' : 'text-white'

    return (
        <div className={`space-y-2 ${className}`}>
            {(content.type === 'text' || content.type === 'text_image') && content.text && (
                <p className={variant === 'question' ? `text-base font-semibold leading-relaxed ${textColor}` : `text-sm leading-relaxed ${textColor}`}>{content.text}</p>
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
