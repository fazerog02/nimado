import { useRef, useState } from 'react'
import Moveable, { OnResizeStart, OnDrag, OnDragStart, OnResize } from 'react-moveable'

interface Props {
	src: string
	keepRatio: boolean
	editable: boolean
	changeEditable: Function
	index: number
	upIndex: Function
	downIndex: Function
	className?: string
	style?: React.CSSProperties
}

const FlexibleIframe = (props: Props) => {
	const [translate, setTranslate] = useState<Array<number>>([0, 0])
	const [moving, setMoving] = useState<boolean>(false)

	const targetRef = useRef<HTMLDivElement>(null)

	const getOptimumHeight = (width: number): number => {
		return (width / 16) * 9 + 30
	}

	return (
		<>
			<div
				ref={targetRef}
				style={Object.assign(
					{ zIndex: moving ? 10001 : 1000 + props.index * 10 },
					props.style ? props.style : {}
				)}
				className={`absolute ${props.className ? props.className : ''}`}
				onMouseDown={() => {
					if (props.editable) setMoving(true)
				}}
				onMouseUp={() => {
					setMoving(false)
				}}
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
						{props.editable ? (
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
						zIndex: props.editable ? (moving ? 10002 : 1001 + props.index * 10) : 0,
					}}
				></div>
				<div className={`absolute inset-0 w-screen h-screen ${moving ? '' : 'hidden'}`}></div>
				<iframe
					src={props.src}
					frameBorder={0}
					allowFullScreen
					className={`absolute top-[30px] left-0 w-full`}
					style={{ height: 'calc(100% - 30px)' }}
				></iframe>
			</div>
			<Moveable
				target={targetRef}
				origin={false}
				draggable={props.editable}
				resizable={props.editable}
				renderDirections={['nw', 'ne', 'sw', 'se']}
				hideDefaultLines={!props.editable}
				onDragStart={(e: OnDragStart) => {
					e.set(translate)
				}}
				onDrag={(e: OnDrag) => {
					setTranslate(e.beforeTranslate)
					e.target.style.transform = `translate(${e.beforeTranslate[0]}px, ${e.beforeTranslate[1]}px)`
				}}
				onResizeStart={(e: OnResizeStart) => {
					e.setOrigin(['%', '%'])
					e.dragStart && e.dragStart.set(translate)
				}}
				onResize={(e: OnResize) => {
					const beforeTranslate = e.drag.beforeTranslate
					setTranslate(beforeTranslate)
					e.target.style.width = `${e.width}px`
					e.target.style.height = props.keepRatio
						? `${getOptimumHeight(e.width)}px`
						: `${e.height}px`
					e.target.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`
				}}
			/>
		</>
	)
}

export default FlexibleIframe
