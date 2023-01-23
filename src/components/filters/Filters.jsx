import React, { useEffect, useState } from 'react'
import Button from './button/Button'
import Dropdown from './dropdown/Dropdown'

const Filters = ({
	allowedPathfinders,
	allowedSpeeds,
	currentPathfinder,
	UpdateCurrentPathfinder,
	currentSpeed,
	UpdateCurrentSpeed,
	GenerateMaze,
	ClearWalls,
	StartVisualizer,
	ResetNodes,
	isRunning,
	needsReset,
}) => {
	return (
		<nav className="filters">
			<ul className="filters__list container">
				<div className="filters__dropdowns">
					<Dropdown
						name={currentPathfinder === '' ? 'Pathfinder' : currentPathfinder}
						dropdownItems={allowedPathfinders} //array of objects {name: '', key: 0}
						itemSelected={UpdateCurrentPathfinder} //event to fire when dropdown item is selected
						currentItem={currentPathfinder} //current item for updating visuals
						offsetMultiplier={0}
					/>
					<Dropdown
						name={currentSpeed === '' ? 'Select Speed' : currentSpeed}
						dropdownItems={allowedSpeeds} //array of objects {speed: '', key: 0}
						itemSelected={UpdateCurrentSpeed} //event to fire when dropdown item is selected
						currentItem={currentSpeed} //current item for updating visuals
						offsetMultiplier={1}
					/>
				</div>
				<div className="filters__buttons">
					<Button
						name={'Clear Walls'}
						onPressed={ClearWalls}
						color={isRunning ? 'faint' : 'default'}
					/>
					<Button
						name={'Create Maze'}
						onPressed={GenerateMaze}
						color={isRunning ? 'faint' : 'default'}
					/>
					<Button
						name={'Clear Path'}
						onPressed={ResetNodes}
						color={needsReset ? 'primary' : 'faint'}
					/>
					<Button
						name={'Run Visualizer'}
						color={
							currentPathfinder !== ''
								? needsReset || isRunning
									? 'faint'
									: 'primary'
								: 'faint'
						}
						onPressed={StartVisualizer}
					/>
				</div>
			</ul>
		</nav>
	)
}

export default Filters
