import { useEffect, useMemo, useState } from 'react'
import StreamContainer from './components/StreamContainer'
import { StreamerData } from './types'

const App = () => {
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [activeStreamerDataList, setActiveStreamerDataList] = useState<StreamerData[]>([
		{
			is_twitch: true,
			id: 'rlgus1006',
			thumbnail_url: '',
			index: 0,
		},
		{
			is_twitch: true,
			id: 'syaruru3',
			thumbnail_url: '',
			index: 1,
		},
	])

	const stream_containers = useMemo(() => {
		return activeStreamerDataList.map<JSX.Element>((data: StreamerData) => {
			return (
				<StreamContainer
					key={data.id}
					streamer_data={data}
					index={data.index}
					upIndex={() => upIndex(data.index)}
					downIndex={() => downIndex(data.index)}
				/>
			)
		})
	}, [activeStreamerDataList])

	const chat_containers = useMemo(() => {
		return activeStreamerDataList.map<JSX.Element>((data: StreamerData) => {
			return (
				<StreamContainer
					key={data.id}
					streamer_data={data}
					index={data.index}
					upIndex={() => upIndex(data.index)}
					downIndex={() => downIndex(data.index)}
				/>
			)
		})
	}, [activeStreamerDataList])

	const upIndex = (target: number) => {
		console.log(target, 'up')
		if (target >= activeStreamerDataList.length - 1 || target < 0) return
		let new_streamerDataList = activeStreamerDataList.slice()
		const target_indexes = [-1, -1]
		for (let i = 0; i < new_streamerDataList.length; i++) {
			if (new_streamerDataList[i].index == target) target_indexes[0] = i
			if (new_streamerDataList[i].index == target + 1) target_indexes[1] = i
		}
		new_streamerDataList[target_indexes[0]].index = target + 1
		new_streamerDataList[target_indexes[1]].index = target
		setActiveStreamerDataList(new_streamerDataList)
	}

	const downIndex = (target: number) => {
		console.log(target, 'down')
		if (target < 1 || target >= activeStreamerDataList.length) return
		let new_streamerDataList = activeStreamerDataList.slice()
		const target_indexes = [-1, -1]
		for (let i = 0; i < new_streamerDataList.length; i++) {
			if (new_streamerDataList[i].index == target - 1) target_indexes[0] = i
			if (new_streamerDataList[i].index == target) target_indexes[1] = i
		}
		new_streamerDataList[target_indexes[0]].index = target
		new_streamerDataList[target_indexes[1]].index = target - 1
		setActiveStreamerDataList(new_streamerDataList)
	}

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
