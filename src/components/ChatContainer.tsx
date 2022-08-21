import { useState } from 'react'
import { StreamerData } from '../types'
import FlexibleIframe from './FlexibleIframe'

interface Props {
	streamer_data: StreamerData
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
			src={`https://twitch.tv/embed/${props.streamer_data.id}/chat?parent=localhost&parent=localhost`}
			style={Object.assign(
				{
					width: '20%',
					height: '100%',
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
