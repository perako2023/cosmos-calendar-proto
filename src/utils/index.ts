import { useEffect, useState } from 'react'

export const useScrollToBottom = (options?: ScrollIntoViewOptions) => {
	const [canTrigger, setCanTrigger] = useState(false)

	const scrollToBottom = () => {
		setCanTrigger(true)
	}

	useEffect(() => {
		window.scrollTo(
			options ?? {
				top: document.body.scrollHeight,
				behavior: 'smooth',
			},
		)
		setCanTrigger(false)
	}, [canTrigger, options])

	return { trigger: scrollToBottom }
}
