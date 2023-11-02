'use client'
import { type TextareaHTMLAttributes } from 'react'
import classNames from 'classnames'

type TextEditorProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
	// isRichText?: boolean

	noNewLine?: boolean
}

export default function TextEditor({ noNewLine, ...props }: TextEditorProps) {
	const classes = classNames(
		'textarea',
		'resize-none',
		'border',
		'border-white/20',
		props.className,
	)

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const textArea = e.currentTarget
		textArea.style.height = 'auto'
		textArea.style.height = `${textArea.scrollHeight + 2}px`

		props.onChange?.(e)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (noNewLine && e.key === 'Enter') {
			e.preventDefault()
			return
		}

		props.onKeyDown?.(e)
	}

	return (
		<textarea
			{...props}
			onChange={handleChange}
			className={classes}
			onKeyDown={handleKeyDown}
		/>
	)
}
