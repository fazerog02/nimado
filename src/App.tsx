import { useMemo, useState } from 'react'
import { JsxElement } from 'typescript'
import StreamContainer from './components/StreamContainer'

const App = () => {
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [streamIds, setStreamIds] = useState<string[]>(['rlgus1006', 'syaruru3'])

	const upIndex = (target: number) => {
		console.log(target, 'up')
		if (target >= streamIds.length - 1 || target < 0) return
		let new_streamIds = streamIds.slice()
		const tmp = new_streamIds[target]
		new_streamIds[target] = new_streamIds[target + 1]
		new_streamIds[target + 1] = tmp
		setStreamIds(new_streamIds)
	}

	const downIndex = (target: number) => {
		console.log(target, 'down')
		if (target < 1 || target >= streamIds.length) return
		let new_streamIds = streamIds.slice()
		const tmp = new_streamIds[target]
		new_streamIds[target] = new_streamIds[target - 1]
		new_streamIds[target - 1] = tmp
		setStreamIds(new_streamIds)
	}

	const stream_containers = useMemo(() => {
		return streamIds.map<JSX.Element>((stream_id: string, index: number): JSX.Element => {
			return (
				<StreamContainer
					key={index}
					stream_id={stream_id}
					index={index}
					upIndex={() => upIndex(index)}
					downIndex={() => downIndex(index)}
				/>
			)
		})
	}, [streamIds])

	return (
		<div className='w-screen h-screen bg-dark'>
			<div
				className={`w-screen h-screen absolute inset-0 bg-black/20 ${!addPopup ? 'hidden' : ''}`}
			>
				<div className='mx-auto my-auto w-8 h-7 bg-white'></div>
			</div>

			<div
				onClick={() => setAddPopup(!addPopup)}
				className='absolute z-[10000] rounded-full bottom-4 right-4 w-[64px] h-[64px] bg-twitch_purple text-white flex items-center justify-center'
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-8 w-8'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={3}
				>
					<path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
				</svg>
			</div>

			{stream_containers}
		</div>
	)
}

export default App
