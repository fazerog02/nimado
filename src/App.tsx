import { useEffect, useMemo, useState, ChangeEvent, useRef, KeyboardEvent } from 'react'

import ChatContainer from './components/ChatContainer'
import MinimizedContainer from './components/MinimizedContainer'
import Popup from './components/Popup'
import StreamContainer from './components/StreamContainer'
import { ContentData, Position, Size } from './types'

interface AddContentFormData {
	url_or_id: string
}

interface PositionAndSize {
	height: string | number
	width: string | number
	x: number
	y: number
}

const App = () => {
	const [bottomMenu, setBottomMenu] = useState<boolean>(false)
	const [addPopup, setAddPopup] = useState<boolean>(false)
	const [minimizedContentFolder, setMinimizedContentFolder] = useState<boolean>(false)
	const [gridMode, setGridMode] = useState<boolean>(true)
	const gridModeRef = useRef<boolean | null>(null)
	gridModeRef.current = gridMode
	const [allMute, setAllMute] = useState<boolean>(false)
	const [allPlay, setAllPlay] = useState<boolean>(true)

	const [addContentFormData, setAddContentFormData] = useState<AddContentFormData>({
		url_or_id: '',
	})
	const [activeContentDataList, setActiveContentDataList] = useState<ContentData[]>([])
	const activeContentDataListRef = useRef<ContentData[] | null>(null)
	activeContentDataListRef.current = activeContentDataList
	const [minimizedContentDataList, setMinimizedContentDataList] = useState<ContentData[]>([])
	const minimizedContentDataListRef = useRef<ContentData[] | null>(null)
	minimizedContentDataListRef.current = minimizedContentDataList

	const [minimizedContentFolderIndex, setMinimizedContentFolderIndex] = useState<number>(0)

	const switchAllMute = () => setAllMute(!allMute)

	const switchAllPlay = () => setAllPlay(!allPlay)

	const upIndex = (target: number) => {
		if (target >= activeContentDataList.length - 1 || target < 0) return
		let new_streamerDataList = activeContentDataList.slice()
		const target_indexes = [-1, -1]
		for (let i = 0; i < new_streamerDataList.length; i++) {
			if (new_streamerDataList[i].index === target) target_indexes[0] = i
			if (new_streamerDataList[i].index === target + 1) target_indexes[1] = i
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
			if (new_streamerDataList[i].index === target - 1) target_indexes[0] = i
			if (new_streamerDataList[i].index === target) target_indexes[1] = i
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
			if (target === data.index) {
				target_arr_index = index
			} else if (target < data.index) {
				data.index -= 1
			}
		})
		if (target_arr_index < 0) return
		const removed_content_data = new_activeContentDataList[target_arr_index]
		setMinimizedContentDataList(minimizedContentDataList.concat([removed_content_data]))
		new_activeContentDataList.splice(target_arr_index, 1)
		setActiveContentDataList(
			gridMode ? updateGrid(new_activeContentDataList) : new_activeContentDataList
		)
	}

	const returnMinimizedContent = (index: number) => {
		const new_data: ContentData = JSON.parse(
			JSON.stringify(minimizedContentDataListRef.current![index])
		)
		new_data.index = activeContentDataListRef.current!.length
		new_data.setSize = (size: Size) => setContentSize(new_data.index, size)
		new_data.setPosition = (position: Position) => setContentPosition(new_data.index, position)
		const new_activeContentDataList = activeContentDataListRef.current!.slice().concat(new_data)
		setActiveContentDataList(
			gridModeRef.current! ? updateGrid(new_activeContentDataList) : new_activeContentDataList
		)

		const new_minimizedContentDataList = minimizedContentDataListRef.current!.slice()
		new_minimizedContentDataList.splice(index, 1)
		setMinimizedContentDataList(new_minimizedContentDataList)
	}

	const deleteMinimizedContent = (index: number) => {
		const new_minimizedContentDataList = minimizedContentDataListRef.current!.slice()
		new_minimizedContentDataList.splice(index, 1)
		setMinimizedContentDataList(new_minimizedContentDataList)
	}

	const percent2pixel = (percent: number[]) => {
		// [x, y]
		return [(window.innerWidth * percent[0]) / 100, (window.innerHeight * percent[1]) / 100]
	}

	const getDefaultChatPositionAndSize = (
		is_new: boolean = true,
		index?: number,
		data_len?: number
	): PositionAndSize => {
		const MAX_WIDTH = 20
		let c_len: number = 0
		let c_index: number = 0
		if (is_new) {
			const active_chat_content_data_list = activeContentDataListRef.current!.filter(
				(data: ContentData) => data.is_chat
			)
			c_len = active_chat_content_data_list.length + 1
			c_index = active_chat_content_data_list.length
		} else {
			c_len = data_len!
			c_index = index!
		}

		let chat_grid_cols: number = 1
		let chat_grid_rows: number = 1
		while (c_len > chat_grid_rows * chat_grid_cols) {
			if (chat_grid_cols < chat_grid_rows) chat_grid_cols += 1
			else chat_grid_rows += 1
		}

		const width = MAX_WIDTH / chat_grid_cols
		const height = 100 / chat_grid_rows

		const x_percent = 100 - width - width * Math.floor(c_index / chat_grid_rows)
		const y_percent = height * (c_index % chat_grid_rows)
		const position_pixel = percent2pixel([x_percent, y_percent])

		return {
			height: `${height}%`,
			width: `${width}%`,
			x: position_pixel[0],
			y: position_pixel[1],
		}
	}

	const getDefaultStreamPositionAndSize = (
		is_new: boolean = true,
		index?: number,
		data_len?: number
	): PositionAndSize => {
		const MAX_WIDTH = 80
		let s_len: number = 0
		let s_index: number = 0
		if (is_new) {
			const active_chat_content_data_list = activeContentDataListRef.current!.filter(
				(data: ContentData) => !data.is_chat
			)
			s_len = active_chat_content_data_list.length + 1
			s_index = active_chat_content_data_list.length
		} else {
			s_len = data_len!
			s_index = index!
		}

		let stream_grid_cols: number = 1
		let stream_grid_rows: number = 1
		if (s_len === 2) {
			stream_grid_cols = 2
			stream_grid_rows = 1
		} else {
			while (s_len > stream_grid_rows * stream_grid_cols) {
				if (stream_grid_cols < stream_grid_rows) stream_grid_cols += 1
				else stream_grid_rows += 1
			}
		}

		const width = MAX_WIDTH / stream_grid_cols

		const size_pixel = percent2pixel([width, 0])
		size_pixel[1] = (size_pixel[0] / 16) * 9 + 30

		const is_height_over = size_pixel[1] * stream_grid_rows > window.innerHeight
		if (is_height_over) {
			size_pixel[1] = window.innerHeight / stream_grid_rows
			size_pixel[0] = ((size_pixel[1] - 30) / 9) * 16
		}

		const position_pixel = [
			size_pixel[0] * Math.floor(s_index / stream_grid_rows),
			size_pixel[1] * (s_index % stream_grid_rows) +
				(window.innerHeight - size_pixel[1] * stream_grid_rows) / 2,
		]
		if (is_height_over) {
			position_pixel[0] += (percent2pixel([MAX_WIDTH, 0])[0] - size_pixel[0] * stream_grid_cols) / 2
			position_pixel[1] = size_pixel[1] * (s_index % stream_grid_rows)
		}

		return {
			height: size_pixel[1],
			width: size_pixel[0],
			x: position_pixel[0],
			y: position_pixel[1],
		}
	}

	const setContentSize = (index: number, size: Size) => {
		const new_activeContentDataList = activeContentDataListRef.current!.slice()
		new_activeContentDataList.forEach((data: ContentData) => {
			if (data.index === index) {
				data.size.width = size.width
				data.size.height = size.height
			}
		})
		setActiveContentDataList(new_activeContentDataList)
	}

	const setContentPosition = (index: number, position: Position) => {
		const new_activeContentDataList = activeContentDataListRef.current!.slice()
		new_activeContentDataList.forEach((data: ContentData) => {
			if (data.index === index) {
				data.position.x = position.x
				data.position.y = position.y
			}
		})
		setActiveContentDataList(new_activeContentDataList)
	}

	const updateGrid = (data_list: ContentData[]): ContentData[] => {
		const new_data_list = data_list.slice()

		let c_len = 0
		let s_len = 0
		new_data_list.forEach((data: ContentData) => {
			if (data.is_chat) c_len++
			else s_len++
		})

		let c_index = 0
		let s_index = 0
		let position_and_size: PositionAndSize
		new_data_list.forEach((data: ContentData) => {
			if (data.is_chat) {
				position_and_size = getDefaultChatPositionAndSize(false, c_index, c_len)
				c_index++
			} else {
				position_and_size = getDefaultStreamPositionAndSize(false, s_index, s_len)
				s_index++
			}
			data.position = { x: position_and_size.x, y: position_and_size.y }
			data.size = { width: position_and_size.width, height: position_and_size.height }
		})
		return new_data_list
	}

	const getStreamIdFromUrl = (url: string): string | null => {
		try {
			const parsed_url = new URL(url)
			const stream_id = parsed_url.pathname.replaceAll('/', '')
			return stream_id === '' ? null : stream_id
		} catch {
			return null
		}
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
		const data_list_len = activeContentDataList.length
		ulr_or_id_list.forEach((ulr_or_id: string, for_index: number) => {
			const stream_position_and_size = getDefaultStreamPositionAndSize(true)
			const new_stream_data: ContentData = {
				position: { x: stream_position_and_size.x, y: stream_position_and_size.y },
				setPosition: () => {},
				size: { width: stream_position_and_size.width, height: stream_position_and_size.height },
				setSize: () => {},
				service: 'twitch',
				is_chat: false,
				stream_id: '',
				thumbnail_url: '',
				index: data_list_len + for_index * 2,
			}
			new_stream_data.setSize = (size: Size) => setContentSize(new_stream_data.index, size)
			new_stream_data.setPosition = (position: Position) =>
				setContentPosition(new_stream_data.index, position)

			const stream_id: string | null = getStreamIdFromUrl(ulr_or_id)
			new_stream_data.stream_id = stream_id === null ? ulr_or_id : stream_id

			const new_chat_data: ContentData = JSON.parse(JSON.stringify(new_stream_data))
			new_chat_data.is_chat = true
			new_chat_data.index += 1
			const chat_position_and_size = getDefaultChatPositionAndSize(true)
			new_chat_data.position = { x: chat_position_and_size.x, y: chat_position_and_size.y }
			new_chat_data.size = {
				width: chat_position_and_size.width,
				height: chat_position_and_size.height,
			}
			new_chat_data.setSize = (size: Size) => setContentSize(new_chat_data.index, size)
			new_chat_data.setPosition = (position: Position) =>
				setContentPosition(new_chat_data.index, position)

			switch (new_stream_data.service) {
				// case 'youtube': {
				// 	new_stream_data.src = `https://www.youtube.com/embed/${new_stream_data.stream_id}?autoplay=1`
				// 	new_chat_data.src = `https://www.youtube.com/live_chat?v=${new_stream_data.stream_id}&embed_domain=fazerog02.github.io`
				// 	new_stream_data.thumbnail_url = `https://i.ytimg.com/vi/${new_stream_data.stream_id}/maxresdefault_live.jpg`
				// 	new_chat_data.thumbnail_url = '/nimado/youtube_chat_icon.png'
				// 	break
				// }
				case 'twitch': {
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

		let new_activeContentDataList = activeContentDataList.slice()
		new_activeContentDataList = new_activeContentDataList.concat(new_contents)

		if (gridMode) {
			new_activeContentDataList = updateGrid(new_activeContentDataList)
		}

		setActiveContentDataList(new_activeContentDataList)
		return true
	}

	const stream_containers = useMemo(() => {
		return activeContentDataList
			.filter((data: ContentData) => !data.is_chat)
			.map<JSX.Element>((data: ContentData) => {
				return (
					<StreamContainer
						content_data={data}
						downIndex={() => downIndex(data.index)}
						gridMode={gridMode}
						index={data.index}
						is_mute={allMute}
						is_play={allPlay}
						key={`s_${data.stream_id}`}
						minimizeContent={() => minimizeContent(data.index)}
						upIndex={() => upIndex(data.index)}
					/>
				)
			})
	}, [activeContentDataList, gridMode, allMute, allPlay])

	const chat_containers = useMemo(() => {
		const active_chat_content_data_list = activeContentDataList.filter(
			(data: ContentData) => data.is_chat
		)
		return active_chat_content_data_list.map<JSX.Element>((data: ContentData) => {
			return (
				<ChatContainer
					content_data={data}
					downIndex={() => downIndex(data.index)}
					gridMode={gridMode}
					index={data.index}
					is_mute={allMute}
					is_play={allPlay}
					key={`c_${data.stream_id}`}
					minimizeContent={() => minimizeContent(data.index)}
					upIndex={() => upIndex(data.index)}
				/>
			)
		})
	}, [activeContentDataList, gridMode, allMute, allPlay])

	const containers = useMemo(() => {
		return stream_containers.concat(chat_containers)
	}, [stream_containers, chat_containers])

	const minimized_containers = useMemo(() => {
		const new_minimized_containers: JSX.Element[] = []
		for (let i = 0; i < 4; i++) {
			let index = 4 * minimizedContentFolderIndex + i
			if (index >= minimizedContentDataList.length) break
			new_minimized_containers.push(
				<MinimizedContainer
					data={minimizedContentDataList[index]}
					deleteMinimizedContent={() => deleteMinimizedContent(index)}
					key={`${minimizedContentDataList[index].is_chat ? 'c' : 's'}_${
						minimizedContentDataList[index].stream_id
					}`}
					returnMinimizedContent={() => returnMinimizedContent(index)}
				/>
			)
		}
		return new_minimized_containers
	}, [minimizedContentDataList, minimizedContentFolderIndex])

	useEffect(() => {
		window.addEventListener('resize', () => {
			if (gridModeRef.current)
				setActiveContentDataList(updateGrid(activeContentDataListRef.current!))
		})

		const url_parser = new URL(window.location.href)
		if (url_parser.searchParams.has('streams')) {
			const streams_str = url_parser.searchParams.get('streams')
			const streams = streams_str?.split(',')
			if (!(streams === undefined || streams.length <= 0 || streams[0] === '')) {
				addContentData(streams)
			}
		}
	}, [])

	return (
		<div className='h-screen w-screen bg-dark'>
			<div
				className='absolute bottom-4 right-4 z-[10000] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white'
				onClick={() => setBottomMenu(!bottomMenu)}
			>
				{bottomMenu ? (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={3}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M9 5l7 7-7 7' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				) : (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M4 6h16M4 12h16M4 18h16' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				)}
			</div>
			<div
				className='absolute bottom-4 right-4 z-[9999] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white transition-[right] duration-300'
				onClick={() => setAddPopup(true)}
				style={bottomMenu ? { right: 'calc(2rem + 64px)' } : {}}
			>
				<svg
					className='h-8 w-8'
					fill='none'
					stroke='currentColor'
					strokeWidth={2}
					viewBox='0 0 24 24'
					xmlns='http://www.w3.org/2000/svg'
				>
					<path d='M12 4v16m8-8H4' strokeLinecap='round' strokeLinejoin='round' />
				</svg>
			</div>
			<div
				className='absolute bottom-4 right-4 z-[9999] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white transition-[right] duration-300'
				onClick={() => setMinimizedContentFolder(!minimizedContentFolder)}
				style={bottomMenu ? { right: 'calc(3rem + 128px)' } : {}}
			>
				{minimizedContentFolder ? (
					<svg
						className='h-8 w-8'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							clipRule='evenodd'
							d='M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z'
							fillRule='evenodd'
						/>
						<path d='M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z' />
					</svg>
				) : (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</div>
			<div
				className='absolute bottom-4 right-4 z-[9999] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white transition-[right] duration-300'
				onClick={() => {
					if (!gridMode) setActiveContentDataList(updateGrid(activeContentDataListRef.current!))
					setGridMode(!gridMode)
				}}
				style={bottomMenu ? { right: 'calc(4rem + 192px)' } : {}}
			>
				{gridMode ? (
					<svg
						className='h-8 w-8'
						fill='currentColor'
						viewBox='0 0 20 20'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' />
					</svg>
				) : (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</div>
			<div
				className='absolute bottom-4 right-4 z-[9999] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white transition-[right] duration-300'
				onClick={() => {
					switchAllMute()
				}}
				style={bottomMenu ? { right: 'calc(5rem + 256px)' } : {}}
			>
				{allMute ? (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				) : (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</div>
			<div
				className='absolute bottom-4 right-4 z-[9999] flex h-[64px] w-[64px] items-center justify-center rounded-full bg-twitch_purple text-white transition-[right] duration-300'
				onClick={() => {
					switchAllPlay()
				}}
				style={bottomMenu ? { right: 'calc(6rem + 320px)' } : {}}
			>
				{allPlay ? (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				) : (
					<svg
						className='h-8 w-8'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path
							d='M15.75 5.25v13.5m-7.5-13.5v13.5'
							strokeLinecap='round'
							strokeLinejoin='round'
						/>
					</svg>
				)}
			</div>

			{containers}

			<Popup closePopup={() => setAddPopup(false)} is_open={addPopup} title='配信の追加'>
				<div className='w-[50vw]'>
					<input
						className='mb-6 block w-11/12 border-b border-light_gray p-2 focus:border-twitch_purple focus:outline-none'
						onChange={(e: ChangeEvent<HTMLInputElement>) =>
							setAddContentFormData({
								...addContentFormData,
								url_or_id: e.target.value,
							})
						}
						onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => {
							if (e.key === 'Enter') {
								addContentData([addContentFormData.url_or_id])
								setAddContentFormData({ ...addContentFormData, url_or_id: '' })
							}
						}}
						placeholder='配信URLまたは配信者ID(ex: t:ninja)'
						value={addContentFormData.url_or_id}
					></input>
					<button
						className='float-right rounded-lg bg-twitch_purple py-3 px-5 text-center text-lg text-white'
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
				className={`absolute bottom-0 left-0 z-[9990] flex h-[30%] w-full flex-row gap-0 p-4 ${
					minimizedContentFolder ? '' : 'hidden'
				}`}
			>
				<div
					className='flex h-full w-[5%] items-center justify-center text-gray'
					onClick={() => {
						if (minimizedContentFolderIndex <= 0) return
						setMinimizedContentFolderIndex(minimizedContentFolderIndex - 1)
					}}
				>
					<svg
						className='h-10 w-10'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M15 19l-7-7 7-7' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				</div>
				<div className='grid h-full w-[90%] grid-cols-4 grid-rows-1 gap-5 rounded-lg bg-heavy_gray py-6 px-4'>
					{minimized_containers}
				</div>
				<div
					className='flex h-full w-[5%] items-center justify-center text-gray'
					onClick={() => {
						if ((minimizedContentFolderIndex + 1) * 4 >= minimizedContentDataList.length) return
						setMinimizedContentFolderIndex(minimizedContentFolderIndex + 1)
					}}
				>
					<svg
						className='h-10 w-10'
						fill='none'
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M9 5l7 7-7 7' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
				</div>
			</div>
		</div>
	)
}

export default App
