import { useState } from 'react'

import { ContentData, Position, Size } from '../types'

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
	is_play: boolean
	is_mute: boolean
}

const ChatContainer = (props: Props) => {
	const [editable, setEditable] = useState<boolean>(true)

	return (
		<FlexibleIframe
			changeEditable={() => setEditable(!editable)}
			className={props.className ? props.className : ''}
			downIndex={() => props.downIndex()}
			editable={editable}
			gridMode={props.gridMode}
			index={props.index}
			is_chat={true}
			is_mute={props.is_mute}
			is_play={props.is_play}
			keepRatio={false}
			minimizeContent={() => props.minimizeContent()}
			position={props.content_data.position}
			setPosition={(position: Position) => props.content_data.setPosition(position)}
			setSize={(size: Size) => props.content_data.setSize(size)}
			size={props.content_data.size}
			stream_id={props.content_data.stream_id}
			style={props.style ? props.style : {}}
			upIndex={() => props.upIndex()}
		/>
	)
}

export default ChatContainer
