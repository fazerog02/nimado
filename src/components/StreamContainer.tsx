import { useState } from 'react'
import { ContentData } from '../types'
import FlexibleIframe from './FlexibleIframe'

interface Props {
	streamer_data: ContentData
	index: number
	upIndex: Function
	downIndex: Function
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
			src={`https://player.twitch.tv/?muted=true&channel=${props.streamer_data.id}&parent=localhost&parent=localhost`}
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
		/>
	)
}

export default StreamContainer
