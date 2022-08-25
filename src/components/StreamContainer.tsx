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
			keepRatio
			minimizeContent={() => props.minimizeContent()}
			position={props.content_data.position}
			setPosition={(position: Position) => props.content_data.setPosition(position)}
			setSize={(size: Size) => props.content_data.setSize(size)}
			size={props.content_data.size}
			src={props.content_data.src}
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
