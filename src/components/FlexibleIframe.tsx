import { ResizeDirection } from 're-resizable'
import { useState, useEffect } from 'react'
import { DraggableData, ResizableDelta, Rnd } from 'react-rnd'

import Twitch from '../twitch_embed_v1'
import { Position, Size } from '../types'

interface Props {
	position: Position
	setPosition: Function
	size: Size
	setSize: Function
	stream_id: string
	is_chat: boolean
	keepRatio: boolean
	editable: boolean
	changeEditable: Function
	index: number
	upIndex: Function
	downIndex: Function
	minimizeContent: Function
	gridMode: boolean
	className?: string
	style?: React.CSSProperties
	is_play: boolean
	is_mute: boolean
}

const FlexibleIframe = (props: Props) => {
	const [moving, setMoving] = useState<boolean>(false)
	const [controller, setController] = useState<any>(null)

	useEffect(() => {
		if (!props.is_chat && controller === null) {
			setController(
				new Twitch.Player(`s_embed_${props.stream_id}`, {
					width: '100%',
					height: '100%',
					channel: props.stream_id,
					parent: ['localhost'],
				})
			)

			return () => {
				const embed_div = document.getElementById(`s_embed_${props.stream_id}`)
				if (embed_div !== null && embed_div.lastChild !== null)
					embed_div.removeChild(embed_div.lastChild)
				setController(null)
			}
		}
	}, [])

	useEffect(() => {
		if (controller !== null) {
			props.is_play ? controller.play() : controller.pause()
		}
	}, [props.is_play])

	useEffect(() => {
		if (controller !== null) {
			controller.setMuted(props.is_mute)
		}
	}, [props.is_mute])

	return (
		<Rnd
			className={`absolute ${props.className ? props.className : ''}`}
			disableDragging={props.gridMode || !props.editable}
			enableResizing={!props.gridMode && props.editable}
			lockAspectRatio={props.keepRatio ? 16 / 9 : false}
			lockAspectRatioExtraHeight={30}
			onDragStart={() => {
				if (props.editable) setMoving(true)
			}}
			onDragStop={(e: any, data: DraggableData) => {
				setMoving(false)
				props.setPosition({ x: data.x, y: data.y })
			}}
			onResizeStart={() => {
				if (props.editable) setMoving(true)
			}}
			onResizeStop={(
				e: MouseEvent | TouchEvent,
				dir: ResizeDirection,
				elementRef: HTMLElement,
				delta: ResizableDelta,
				position: Position
			) => {
				setMoving(false)
				props.setSize({ width: elementRef.style.width, height: elementRef.style.height })
				props.setPosition(position)
			}}
			position={props.position}
			size={props.size}
			style={Object.assign(
				{
					zIndex: moving ? 10001 : 1000 + props.index * 10,
				},
				props.style ? props.style : {}
			)}
		>
			<div className='absolute inset-0 h-[30px] w-full bg-light_dark text-white'>
				<div
					className='relative ml-auto flex h-full w-fit max-w-full items-center gap-3 px-3'
					style={moving ? { zIndex: 10003 } : {}}
				>
					<svg
						className='h-full p-1'
						fill='none'
						onClick={() => props.minimizeContent()}
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M18 12H6' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
					<svg
						className='h-full p-1'
						fill='none'
						onClick={() => props.upIndex()}
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M5 15l7-7 7 7' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
					<svg
						className='h-full p-1'
						fill='none'
						onClick={() => props.downIndex()}
						stroke='currentColor'
						strokeWidth={2}
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
					>
						<path d='M19 9l-7 7-7-7' strokeLinecap='round' strokeLinejoin='round' />
					</svg>
					{props.gridMode || props.editable ? (
						<svg
							className='h-full p-1'
							fill='currentColor'
							onClick={() => props.changeEditable()}
							viewBox='0 0 20 20'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path d='M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z' />
						</svg>
					) : (
						<svg
							className='h-full p-1'
							fill='currentColor'
							onClick={() => props.changeEditable()}
							viewBox='0 0 20 20'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path
								clipRule='evenodd'
								d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
								fillRule='evenodd'
							/>
						</svg>
					)}
				</div>
			</div>
			<div
				className={`absolute top-[30px] left-0 w-full`}
				style={{
					height: 'calc(100% - 30px)',
					zIndex:
						!props.gridMode && props.editable ? (moving ? 10002 : 1001 + props.index * 10) : 0,
				}}
			></div>
			{props.is_chat ? (
				<iframe
					className={`absolute top-[30px] left-0 w-full`}
					frameBorder={0}
					src={`https://www.twitch.tv/embed/${props.stream_id}/chat?parent=localhost`}
					style={{ height: 'calc(100% - 30px)' }}
					title={`${props.stream_id}'s chat`}
				></iframe>
			) : (
				<div
					className={`absolute top-[30px] left-0 w-full`}
					id={`s_embed_${props.stream_id}`}
					style={{ height: 'calc(100% - 30px)' }}
				></div>
			)}
		</Rnd>
	)
}

export default FlexibleIframe
