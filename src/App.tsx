import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import ChatContainer from './components/ChatContainer'
import Popup from './components/Popup'
import StreamContainer from './components/StreamContainer'
import { ContentData } from './types'

interface AddContentFormData {
	url_or_id: string
}

const App = () => {
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [addContentFormData, setAddContentFormData] = useState<AddContentFormData>({
		url_or_id: '',
	})
	const [activeContentDataList, setActiveContentDataList] = useState<ContentData[]>([])
	const [minimizedContentDataList, setMinimizedContentDataList] = useState<ContentData[]>([])

	const upIndex = (target: number) => {
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

	const minimizeContent = (target: number) => {
		if (target < 0 || target >= activeContentDataList.length) return
		const new_activeContentDataList = activeContentDataList.slice()
		let target_arr_index = -1
		new_activeContentDataList.forEach((data: ContentData, index: number) => {
			if (target == data.index) {
				target_arr_index = index
			} else if (target < data.index) {
				data.index -= 1
			}
		})
		if (target_arr_index < 0) return
		const removed_content_data = new_activeContentDataList[target_arr_index]
		console.log(removed_content_data)
		setMinimizedContentDataList(minimizedContentDataList.concat([removed_content_data]))
		new_activeContentDataList.splice(target_arr_index, 1)
		setActiveContentDataList(new_activeContentDataList)
	}

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
					new_stream_data.src = `https://www.youtube.com/embed/${new_stream_data.stream_id}?autoplay=1`
					new_chat_data.src = `https://www.youtube.com/live_chat?v=${new_stream_data.stream_id}&embed_domain=localhost`
					new_stream_data.thumbnail_url = `https://i.ytimg.com/vi/${new_stream_data.stream_id}/maxresdefault_live.jpg`
					new_chat_data.thumbnail_url = '/nimado/youtube_chat_icon.png'
					break
				}
				case 'twitch': {
					new_stream_data.src = `https://player.twitch.tv/?muted=true&channel=${new_stream_data.stream_id}&parent=localhost`
					new_chat_data.src = `https://twitch.tv/embed/${new_stream_data.stream_id}/chat?parent=localhost`
					new_stream_data.thumbnail_url = `https://static-cdn.jtvnw.net/previews-ttv/live_user_${new_stream_data.stream_id}.jpg`
					new_chat_data.thumbnail_url = '/nimado/twitch_chat_icon.png'
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
						minimizeContent={() => minimizeContent(data.index)}
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
						minimizeContent={() => minimizeContent(data.index)}
					/>
				)
			})
	}, [activeContentDataList])

	const containers = useMemo(() => {
		return stream_containers.concat(chat_containers)
	}, [stream_containers, chat_containers])

	const minimized_containers = useMemo(() => {
		return minimizedContentDataList.map((data: ContentData) => {
			return (
				<div
					onClick={() => {
						const new_data = JSON.parse(JSON.stringify(data))
						new_data.index = activeContentDataList.length
						setActiveContentDataList(activeContentDataList.concat(new_data))

						setMinimizedContentDataList(
							minimizedContentDataList.filter(
								(d: ContentData) => d.stream_id != data.stream_id || d.is_chat != data.is_chat
							)
						)
					}}
				>
					<p>
						{data.stream_id}
						{data.is_chat ? '(chat)' : '(stream)'}
					</p>
					<img src={data.thumbnail_url} />
				</div>
			)
		})
	}, [minimizedContentDataList])

	useEffect(() => {
		addContentData(['https://www.twitch.tv/rlgus1006'])
	}, [])

	return (
		<div className='w-screen h-screen bg-dark'>
			<Popup is_open={addPopup} closePopup={() => setAddPopup(false)}>
				<div>
					<div>配信の追加</div>
					<input
						value={addContentFormData.url_or_id}
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setAddContentFormData({
								...addContentFormData,
								url_or_id: e.target.value,
							})
						}
					></input>
					<button
						onClick={() => {
							addContentData([addContentFormData.url_or_id])
							setAddContentFormData({ ...addContentFormData, url_or_id: '' })
						}}
					>
						追加
					</button>
				</div>
			</Popup>
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
			<div className='absolute bottom-0 left-0 flex flex-row w-full h-[20%]'>
				{minimized_containers}
			</div>
		</div>
	)
}

export default App
