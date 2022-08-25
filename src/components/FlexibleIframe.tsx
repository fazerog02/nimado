import { useState } from 'react'
import { DraggableData, ResizableDelta, Rnd } from 'react-rnd'
import { Position, Size } from '../types'
import { ResizeDirection } from 're-resizable'

interface Props {
	position: Position
	setPosition: Function
	size: Size
	setSize: Function
	src: string
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
}

const FlexibleIframe = (props: Props) => {
	const [moving, setMoving] = useState<boolean>(false)

	return (
		<Rnd
			size={props.size}
			position={props.position}
			style={Object.assign(
				{
					zIndex: moving ? 10001 : 1000 + props.index * 10,
				},
				props.style ? props.style : {}
			)}
			className={`absolute ${props.className ? props.className : ''}`}
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
			disableDragging={props.gridMode || !props.editable}
			enableResizing={!props.gridMode && props.editable}
			lockAspectRatio={props.keepRatio}
			lockAspectRatioExtraHeight={30}
		>
			<div className='absolute inset-0 w-full h-[30px] bg-light_dark text-white'>
				<div
					className='relative w-fit h-full ml-auto px-3 flex items-center gap-3'
					style={moving ? { zIndex: 10003 } : {}}
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-full p-1'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						onClick={() => props.minimizeContent()}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M18 12H6' />
					</svg>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-full p-1'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						onClick={() => props.upIndex()}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M5 15l7-7 7 7' />
					</svg>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						className='h-full p-1'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						strokeWidth={2}
						onClick={() => props.downIndex()}
					>
						<path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
					</svg>
					{props.gridMode || props.editable ? (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-full p-1'
							viewBox='0 0 20 20'
							fill='currentColor'
							onClick={() => props.changeEditable()}
						>
							<path d='M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z' />
						</svg>
					) : (
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='h-full p-1'
							viewBox='0 0 20 20'
							fill='currentColor'
							onClick={() => props.changeEditable()}
						>
							<path
								fillRule='evenodd'
								d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z'
								clipRule='evenodd'
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
			<iframe
				src={props.src}
				frameBorder={0}
				allowFullScreen
				className={`absolute top-[30px] left-0 w-full`}
				style={{ height: 'calc(100% - 30px)' }}
				allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
			></iframe>
		</Rnd>
	)
}

export default FlexibleIframe
