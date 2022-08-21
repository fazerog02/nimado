import { ReactNode } from 'react'

interface Props {
	is_open: boolean
	closePopup: Function
	children?: ReactNode
}

const Popup = (props: Props) => {
	return (
		<div
			className={`absolute inset-0 z-[100000] bg-black/50 flex items-center justify-center ${
				props.is_open ? '' : 'hidden'
			}`}
			onClick={() => props.closePopup()}
		>
			<div className='w-fit h-fit p-7'></div>
		</div>
	)
}

export default Popup
