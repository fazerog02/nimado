import { useState } from 'react'
import FlexibleIframe from './FlexibleIframe'

interface Props {
	stream_id: string
	index: number
	upIndex: Function
	downIndex: Function
}

const StreamContainer = (props: Props) => {
	const [editable, setEditable] = useState<boolean>(true)

	const getOptimumHeight = (width: number): number => {
		return (width / 16) * 9 + 30
	}

	return (
		<FlexibleIframe
			src={`https://player.twitch.tv/?muted=true&channel=${props.stream_id}&parent=localhost&parent=localhost`}
			style={{
				width: document.body.clientWidth / 2,
				height: getOptimumHeight(document.body.clientWidth / 2),
			}}
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
