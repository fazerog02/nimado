import { useEffect, useMemo, useState, ChangeEvent } from 'react'
import ChatContainer from './components/ChatContainer'
import MinimizedContainer from './components/MinimizedContainer'
import Popup from './components/Popup'
import StreamContainer from './components/StreamContainer'
import { ContentData } from './types'

interface AddContentFormData {
	url_or_id: string
}

const App = () => {
	const [bottomMenu, setBottomMenu] = useState<boolean>(false)
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [minimizedContentFolder, setMinimizedContentFolder] = useState<boolean>(false)
	const [gridMode, setGridMode] = useState<boolean>(true)

	const [addContentFormData, setAddContentFormData] = useState<AddContentFormData>({
		url_or_id: '',
	})
	const [activeContentDataList, setActiveContentDataList] = useState<ContentData[]>([])
	const [minimizedContentDataList, setMinimizedContentDataList] = useState<ContentData[]>([])

	const [minimizedContentFolderIndex, setMinimizedContentFolderIndex] = useState<number>(0)

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

	const returnMinimizedContent = (index: number) => {
		const new_data = JSON.parse(JSON.stringify(minimizedContentDataList[index]))
		new_data.index = activeContentDataList.length
		setActiveContentDataList(activeContentDataList.concat(new_data))

		const new_minimizedContentDataList = minimizedContentDataList.slice()
		new_minimizedContentDataList.splice(index, 1)
		setMinimizedContentDataList(new_minimizedContentDataList)
	}

	const addContentData = (ulr_or_id_list: string[]): boolean => {
		ulr_or_id_list = Array.from(new Set(ulr_or_id_list)) // 重複削除

		let stream_id_list_stream: string[] = []
		let stream_id_list_chat: string[] = []
		activeContentDataList.forEach((data: ContentData) => {
			if (data.is_chat) {
				stream_id_list_chat.push(data.stream_id)
			} else {
				stream_id_list_stream.push(data.stream_id)
			}
		})
		minimizedContentDataList.forEach((data: ContentData) => {
			if (data.is_chat) {
				stream_id_list_chat.push(data.stream_id)
			} else {
				stream_id_list_stream.push(data.stream_id)
			}
		})

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

			if (!stream_id_list_stream.includes(new_stream_data.stream_id))
				new_contents.push(new_stream_data)
			if (!stream_id_list_chat.includes(new_stream_data.stream_id)) new_contents.push(new_chat_data)
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
						gridMode={gridMode}
					/>
				)
			})
	}, [activeContentDataList, gridMode])

	const chat_containers = useMemo(() => {
		const active_chat_content_data_list = activeContentDataList.filter(
			(data: ContentData) => data.is_chat
		)
		return active_chat_content_data_list.map<JSX.Element>((data: ContentData, index: number) => {
			let chat_grid_cols: number = 1
			let chat_grid_rows: number = 1
			const c_len = active_chat_content_data_list.length
			while (c_len > chat_grid_rows * chat_grid_cols) {
				if (chat_grid_cols < chat_grid_rows) chat_grid_cols += 1
				else chat_grid_rows += 1
			}
			console.log({ len: c_len, row: chat_grid_rows, col: chat_grid_cols })

			return (
				<ChatContainer
					key={`c_${data.stream_id}`}
					content_data={data}
					index={data.index}
					upIndex={() => upIndex(data.index)}
					downIndex={() => downIndex(data.index)}
					minimizeContent={() => minimizeContent(data.index)}
					gridMode={gridMode}
					style={{
						height: `${100 / chat_grid_rows}%`,
						width: `${30 / chat_grid_cols}%`,
						right: `${(30 / chat_grid_cols) * Math.floor(index / chat_grid_rows)}%`,
						top: `${(100 / chat_grid_rows) * (index % chat_grid_rows)}%`,
						transform: 'none',
					}}
				/>
			)
		})
	}, [activeContentDataList, gridMode])

	const containers = useMemo(() => {
		return stream_containers.concat(chat_containers)
	}, [stream_containers, chat_containers])

	const minimized_containers = useMemo(() => {
		const new_minimized_containers: JSX.Element[] = []
		let index: number
		for (let i = 0; i < 4; i++) {
			index = 4 * minimizedContentFolderIndex + i
			if (index >= minimizedContentDataList.length) break
			new_minimized_containers.push(
				<MinimizedContainer
					data={minimizedContentDataList[index]}
					returnMinimizedContent={() => returnMinimizedContent(index)}
					deleteMinimizedContent={() => 1 + 1}
				/>
			)
		}
		return new_minimized_containers
	}, [minimizedContentDataList, minimizedContentFolderIndex])

	useEffect(() => {
		addContentData(['https://www.twitch.tv/rlgus1006'])
	}, [])

	return (
		<div className='w-screen h-screen bg-dark'>
			<div
				onClick={() => setBottomMenu(!bottomMenu)}
				className='absolute z-[10000] rounded-full bottom-4 right-4 w-[64px] h-[64px] bg-twitch_purple text-white flex items-center justify-center'
			>
				{bottomMenu ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={3}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
					</svg>
				)}
			</div>
			<div
				onClick={() => setAddPopup(true)}
				className='absolute z-[9999] rounded-full bottom-4 right-4 w-[64px] h-[64px] bg-twitch_purple text-white flex items-center justify-center transition-[right] duration-300'
				style={bottomMenu ? { right: 'calc(2rem + 64px)' } : {}}
			>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-8 w-8'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={2}
				>
					<path strokeLinecap='round' strokeLinejoin='round' d='M12 4v16m8-8H4' />
				</svg>
			</div>
			<div
				onClick={() => setMinimizedContentFolder(!minimizedContentFolder)}
				className='absolute z-[9999] rounded-full bottom-4 right-4 w-[64px] h-[64px] bg-twitch_purple text-white flex items-center justify-center transition-[right] duration-300'
				style={bottomMenu ? { right: 'calc(3rem + 128px)' } : {}}
			>
				{minimizedContentFolder ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path
							fillRule='evenodd'
							d='M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z'
							clipRule='evenodd'
						/>
						<path d='M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z' />
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'
						/>
					</svg>
				)}
			</div>
			<div
				onClick={() => setGridMode(!gridMode)}
				className='absolute z-[9999] rounded-full bottom-4 right-4 w-[64px] h-[64px] bg-twitch_purple text-white flex items-center justify-center transition-[right] duration-300'
				style={bottomMenu ? { right: 'calc(4rem + 192px)' } : {}}
			>
				{gridMode ? (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						viewBox='0 0 20 20'
						fill='currentColor'
					>
						<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
					</svg>
				) : (
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-8 w-8'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
						/>
					</svg>
				)}
			</div>
			{containers}

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
				className={`absolute bottom-0 left-0 z-[9990] flex flex-row gap-0 w-full h-[40%] p-4 ${
					minimizedContentFolder ? '' : 'hidden'
				}`}
			>
				<div
					className='w-[5%] h-full flex items-center justify-center text-gray'
					onClick={() => {
						if (minimizedContentFolderIndex <= 0) return
						setMinimizedContentFolderIndex(minimizedContentFolderIndex - 1)
					}}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-10 w-10'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M15 19l-7-7 7-7' />
					</svg>
				</div>
				<div className='grid grid-cols-4 grid-rows-1 gap-5 w-[90%] h-full bg-heavy_gray rounded-lg py-6 px-4'>
					{minimized_containers}
				</div>
				<div
					className='w-[5%] h-full flex items-center justify-center text-gray'
					onClick={() => {
						if ((minimizedContentFolderIndex + 1) * 4 >= minimizedContentDataList.length) return
						setMinimizedContentFolderIndex(minimizedContentFolderIndex + 1)
					}}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-10 w-10'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M9 5l7 7-7 7' />
					</svg>
				</div>
			</div>
		</div>
	)
}

export default App
