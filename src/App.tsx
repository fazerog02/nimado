import { useEffect, useMemo, useState } from 'react'
import ChatContainer from './components/ChatContainer'
import Popup from './components/Popup'
import StreamContainer from './components/StreamContainer'
import { ContentData } from './types'

const App = () => {
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [activeContentDataList, setActiveContentDataList] = useState<ContentData[]>([])

	const addContentData = (ulr_or_id_list: string[]): boolean => {
		let new_contents: ContentData[] = []
		ulr_or_id_list.forEach((ulr_or_id: string, for_index: number) => {
			const new_stream_data: ContentData = {
				service: '',
				is_chat: false,
				stream_id: '',
				src: '',
				thumbnail_url: '',
				index: activeContentDataList.length + for_index * 2,
			}

			if (ulr_or_id.includes('youtube.com')) {
				const raw_params = ulr_or_id.split('?')[1]
				const str_params = raw_params.split('&')
				str_params.forEach((str_param: string) => {
					const key_value = str_param.split('=')
					if (key_value[0] == 'v') new_stream_data.stream_id = key_value[1]
				})
				if (new_stream_data.stream_id == '') return false
				new_stream_data.service = 'youtube'
			} else if (ulr_or_id.includes('twitch.tv')) {
				const paths = ulr_or_id.replace('https://', '').split('/')
				if (paths.length < 2) return false
				new_stream_data.service = 'twitch'
				new_stream_data.stream_id = paths[1]
			} else {
				const prefix_and_id = ulr_or_id.split(':')
				if (prefix_and_id.length != 2) return false
				switch (prefix_and_id[0]) {
					case 'y': {
						new_stream_data.service = 'youtube'
						new_stream_data.stream_id = prefix_and_id[1]
						break
					}
					case 't': {
						new_stream_data.service = 'twitch'
						new_stream_data.stream_id = prefix_and_id[1]
						break
					}
					default: {
						return false
					}
				}
			}

			const new_chat_data: ContentData = JSON.parse(JSON.stringify(new_stream_data))
			new_chat_data.is_chat = true
			new_chat_data.index += 1
			switch (new_stream_data.service) {
				case 'youtube': {
					new_stream_data.src = `https://www.youtube.com/embed/${new_stream_data.stream_id}`
					new_chat_data.src = `https://www.youtube.com/live_chat?is_popout=1&v=${new_stream_data.stream_id}`
					new_stream_data.thumbnail_url = `https://i.ytimg.com/vi/${new_stream_data.stream_id}/maxresdefault_live.jpg`
					new_chat_data.thumbnail_url = '/youtube_chat_icon.png'
					break
				}
				case 'twitch': {
					new_stream_data.src = `https://player.twitch.tv/?muted=true&channel=${new_stream_data.stream_id}&parent=localhost`
					new_chat_data.src = `https://twitch.tv/embed/${new_stream_data.stream_id}/chat&parent=localhost`
					new_stream_data.thumbnail_url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${new_stream_data.stream_id}.jpg`
					new_chat_data.thumbnail_url = '/twitch_chat_icon.png'
					break
				}
				default: {
					return false
				}
			}

			new_contents = new_contents.concat([new_stream_data, new_chat_data])
		})

		setActiveContentDataList(activeContentDataList.concat(new_contents))
		return true
	}

	const stream_containers = useMemo(() => {
		return activeContentDataList
			.filter((data: ContentData) => !data.is_chat)
			.map<JSX.Element>((data: ContentData) => {
				return (
					<StreamContainer
						key={`s_${data.stream_id}`}
						content_data={data}
						index={data.index}
						upIndex={() => upIndex(data.index)}
						downIndex={() => downIndex(data.index)}
					/>
				)
			})
	}, [activeContentDataList])

	const chat_containers = useMemo(() => {
		return activeContentDataList
			.filter((data: ContentData) => data.is_chat)
			.map<JSX.Element>((data: ContentData) => {
				return (
					<ChatContainer
						key={`c_${data.stream_id}`}
						content_data={data}
						index={data.index}
						upIndex={() => upIndex(data.index)}
						downIndex={() => downIndex(data.index)}
					/>
				)
			})
	}, [activeContentDataList])

	const containers = useMemo(() => {
		return stream_containers.concat(chat_containers)
	}, [stream_containers, chat_containers])
	stream_containers
	const upIndex = (target: number) => {
		console.log(target, 'up')
		if (target >= activeContentDataList.length - 1 || target < 0) return
		let new_streamerDataList = activeContentDataList.slice()
		const target_indexes = [-1, -1]
		for (let i = 0; i < new_streamerDataList.length; i++) {
			if (new_streamerDataList[i].index == target) target_indexes[0] = i
			if (new_streamerDataList[i].index == target + 1) target_indexes[1] = i
		}
		new_streamerDataList[target_indexes[0]].index = target + 1
		new_streamerDataList[target_indexes[1]].index = target
		setActiveContentDataList(new_streamerDataList)
	}

	const downIndex = (target: number) => {
		console.log(target, 'down')
		if (target < 1 || target >= activeContentDataList.length) return
		let new_streamerDataList = activeContentDataList.slice()
		const target_indexes = [-1, -1]
		for (let i = 0; i < new_streamerDataList.length; i++) {
			if (new_streamerDataList[i].index == target - 1) target_indexes[0] = i
			if (new_streamerDataList[i].index == target) target_indexes[1] = i
		}
		new_streamerDataList[target_indexes[0]].index = target
		new_streamerDataList[target_indexes[1]].index = target - 1
		setActiveContentDataList(new_streamerDataList)
	}

	useEffect(() => {
		addContentData(['t:rlgus1006', 't:syaruru3'])
	}, [])

	return (
		<div className='w-screen h-screen bg-dark'>
			container
			<Popup is_open={addPopup} closePopup={() => setAddPopup(false)}></Popup>
			<div
				onClick={() => setAddPopup(true)}
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
			{containers}
		</div>
	)
}

export default App
