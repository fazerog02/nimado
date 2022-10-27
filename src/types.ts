export interface ContentData {
	position: Position
	setPosition: Function
	size: Size
	setSize: Function
	service: string
	is_chat: boolean
	stream_id: string
	thumbnail_url: string
	index: number
}

export interface Position {
	x: number
	y: number
}

export interface Size {
	width: number | string
	height: number | string
}
