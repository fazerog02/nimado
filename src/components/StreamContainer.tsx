import { useState } from 'react'

import { ContentData, Size, Position } from '../types'

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

const StreamContainer = (props: Props) => {
	const [editable, setEditable] = useState<boolean>(true)

	const getOptimumHeight = (width: number): number => {
		return (width / 16) * 9 + 30
	}

	return (
		<FlexibleIframe
			changeEditable={() => setEditable(!editable)}
			className={props.className ? props.className : ''}
			downIndex={() => props.downIndex()}
			editable={editable}
			gridMode={props.gridMode}
			index={props.index}
			is_chat={false}
			is_mute={props.is_mute}
			is_play={props.is_play}
			keepRatio
			minimizeContent={() => props.minimizeContent()}
			position={props.content_data.position}
			setPosition={(position: Position) => props.content_data.setPosition(position)}
			setSize={(size: Size) => props.content_data.setSize(size)}
			size={props.content_data.size}
			stream_id={props.content_data.stream_id}
			style={Object.assign(
				{
					width: document.body.clientWidth / 2,
					height: getOptimumHeight(document.body.clientWidth / 2),
				},
				props.style ? props.style : {}
			)}
			upIndex={() => props.upIndex()}
		/>
	)
}

export default StreamContainer
