import { useState } from 'react'
import { ContentData } from '../types'
import FlexibleIframe from './FlexibleIframe'

interface Props {
	content_data: ContentData
	index: number
	upIndex: Function
	downIndex: Function
	className?: string
	style?: React.CSSProperties
}

const ChatContainer = (props: Props) => {
	const [editable, setEditable] = useState<boolean>(true)

	const getOptimumHeight = (width: number): number => {
		return (width / 16) * 9 + 30
	}

	return (
		<FlexibleIframe
			src={props.content_data.src}
			style={Object.assign(
				{
					width: '20%',
					height: '95%',
				},
				props.style ? props.style : {}
			)}
			className={props.className ? props.className : ''}
			editable={editable}
			changeEditable={() => setEditable(!editable)}
			keepRatio={false}
			index={props.index}
			upIndex={() => props.upIndex()}
			downIndex={() => props.downIndex()}
		/>
	)
}

export default ChatContainer
