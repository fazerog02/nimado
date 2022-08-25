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
			position={props.content_data.position}
			setPosition={(position: Position) => props.content_data.setPosition(position)}
			size={props.content_data.size}
			setSize={(size: Size) => props.content_data.setSize(size)}
			src={props.content_data.src}
			style={Object.assign(
				{
					width: document.body.clientWidth / 2,
					height: getOptimumHeight(document.body.clientWidth / 2),
				},
				props.style ? props.style : {}
			)}
			className={props.className ? props.className : ''}
			editable={editable}
			changeEditable={() => setEditable(!editable)}
			keepRatio
			index={props.index}
			upIndex={() => props.upIndex()}
			downIndex={() => props.downIndex()}
			minimizeContent={() => props.minimizeContent()}
			gridMode={props.gridMode}
		/>
	)
}

export default StreamContainer
