import { ContentData } from '../types'

interface Props {
	data: ContentData
	returnMinimizedContent: Function
	deleteMinimizedContent: Function
}

const MinimizedContainer = (props: Props) => {
	return (
		<div className='h-full text-center text-white' onClick={() => props.returnMinimizedContent()}>
			<img className='h-[90%] mx-auto' src={props.data.thumbnail_url} />
			<p className='h-[10%]'>
				{props.data.stream_id}
				{props.data.is_chat ? '(chat)' : '(stream)'}
			</p>
		</div>
	)
}

export default MinimizedContainer
