import { ContentData } from '../types'

interface Props {
	data: ContentData
	returnMinimizedContent: Function
	deleteMinimizedContent: Function
}

const MinimizedContainer = (props: Props) => {
	return (
		<div className='relative h-full text-white'>
			<div
				className='absolute -top-3 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-light_red'
				onClick={() => props.deleteMinimizedContent()}
			>
				<svg
					className='h-4 w-4'
					fill='none'
					stroke='currentColor'
					strokeWidth={3}
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M4.5 19.5l15-15m-15 0l15 15' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			</div>
			<div className='h-full w-full text-center' onClick={() => props.returnMinimizedContent()}>
				<img
					alt={`${props.data.stream_id}'s ${props.data.is_chat ? 'chat' : 'stream'}`}
					className='mx-auto h-[90%]'
					src={props.data.thumbnail_url}
				/>
				<p className='h-[10%]'>
					{props.data.stream_id}
					{props.data.is_chat ? '(chat)' : '(stream)'}
				</p>
			</div>
		</div>
	)
}

export default MinimizedContainer
