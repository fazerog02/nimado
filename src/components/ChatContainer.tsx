import { useState } from 'react'
import { ContentData } from '../types'
import FlexibleIframe from './FlexibleIframe'

interface Props {
	content_data: ContentData
	index: number
	upIndex: Function
	downIndex: Function
	minimizeContent: Function
	gridMode: boolean
	className?: string
	style?: React.CSSProperties
}

const ChatContainer = (props: Props) => {
	const [editable, setEditable] = useState<boolean>(true)

	return (
		<FlexibleIframe
			src={props.content_data.src}
			style={props.style ? props.style : {}}
			className={props.className ? props.className : ''}
			editable={editable}
			changeEditable={() => setEditable(!editable)}
			keepRatio={false}
			index={props.index}
			upIndex={() => props.upIndex()}
			downIndex={() => props.downIndex()}
			minimizeContent={() => props.minimizeContent()}
			gridMode={props.gridMode}
		/>
	)
}

export default ChatContainer
