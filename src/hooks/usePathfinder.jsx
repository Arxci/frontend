import React, { useEffect, useState } from 'react'

const usePathfinder = () => {
	const [currentPathfinder, setCurrentPathfinder] = useState('')
	const [currentSpeed, setCurrentSpeed] = useState('')
	const [grid, setGrid] = useState([])
	const [numOfRows, setNumOfRows] = useState(0)

	const numOfCols = 50

	const allowedPathfinders = [
		{ name: 'A Star', key: 0 },
		{ name: "Dijkstra's", key: 1 },
	]

	const allowedSpeeds = [
		{ name: 'Slow', key: 0 },
		{ name: 'Medium', key: 1 },
		{ name: 'Fast', key: 2 },
	]

	const UpdateCurrentPathfinder = (newPathfinder) => {
		setCurrentPathfinder(newPathfinder)
	}

	const UpdateCurrentSpeed = (newSearchSpeed) => {
		setCurrentSpeed(newSearchSpeed)
	}

	function ClearWalls() {
		const gridContent = document.querySelector('.grid__content').children
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				const temp = GetGridIndex(i, j)
				if (gridContent[temp].className === 'grid__item wall') {
					gridContent[temp].className = 'grid__item'
				}
			}
		}
	}

	function Partition(h, minX, maxX, minY, maxY) {
		if (h) {
			if (maxX - minX < 2) {
				return
			}

			var y = Math.floor(randomNumber(minY, maxY) / 2) * 2
			addHWall(minX, maxX, y)

			Partition(!h, minX, maxX, minY, y - 1)
			Partition(!h, minX, maxX, y + 1, maxY)
		} else {
			if (maxY - minY < 2) {
				return
			}

			var x = Math.floor(randomNumber(minX, maxX) / 2) * 2
			addVWall(minY, maxY, x)

			Partition(!h, minX, x - 1, minY, maxY)
			Partition(!h, x + 1, maxX, minY, maxY)
		}
	}

	function RemoveFromArray(arr, elt) {
		for (var i = arr.length - 1; i >= 0; i--) {
			if (arr[i] === elt) {
				arr.splice(i, 1)
			}
		}
	}

	function IsWall(i, j) {
		const gridContent = document.querySelector('.grid__content').children
		const gridItem = gridContent[GetGridIndex(i, j)]
		return gridItem.className === 'grid__item wall'
	}

	function GetStartPos() {
		const gridContent = document.querySelector('.grid__content').children
		var pos = []
		for (var i = 0; i < numOfRows; i++) {
			for (var j = 0; j < numOfCols; j++) {
				const temp = GetGridIndex(i, j)
				const gridItem = gridContent[temp]
				if (gridItem) {
					if (gridItem.className == 'grid__item start') {
						pos = [i, j]
						break
					}
				}
			}
		}
		return pos
	}

	function GetEndPos() {
		const gridContent = document.querySelector('.grid__content').children
		var pos = []
		for (var i = 0; i < numOfRows; i++) {
			for (var j = 0; j < numOfCols; j++) {
				const temp = GetGridIndex(i, j)
				const gridItem = gridContent[temp]
				if (gridItem) {
					if (gridItem.className == 'grid__item target') {
						pos = [i, j]
						break
					}
				}
			}
		}
		return pos
	}

	function StartVisualizer() {
		if (GetEndPos().length === 0) {
			console.log('place end node')
			return
		} else if (GetStartPos().length === 0) {
			console.log('place start node')
			return
		}

		console.log('test')
		switch (currentPathfinder) {
			case '':
				return
			case 'A Star':
				for (var i = 0; i < numOfRows; i++) {
					for (var j = 0; j < numOfCols; j++) {
						UpdateNeighbors(i, j)
					}
				}
				StartAStar()
				break
			case "Dijkstra's":
				break
		}
	}

	function ReBuildPath(current, timer) {
		clearInterval(timer)
		var path = []
		var temp = current
		path.push(temp)
		var t
		if (temp.previous !== undefined) {
			t = setInterval(() => {
				const gridContent = document.querySelector('.grid__content').children
				const gridItem = gridContent[GetGridIndex(temp.i, temp.j)]
				gridItem.classList.toggle('closed__node')
				gridItem.classList.toggle('best__path')
				path.push(temp.previous)
				temp = temp.previous
				if (temp.previous === undefined) {
					clearInterval(t)
				}
			}, 25)
		}
	}

	function RunAStar(openSet, closedSet, timer, end) {
		var lowestFValue = 0
		for (var i = 0; i < openSet.length; i++) {
			if (openSet[i].f < openSet[lowestFValue].f) {
				lowestFValue = i
			}
		}
		var current = openSet[lowestFValue]

		if (current === end) {
			ReBuildPath(current, timer)
		}

		RemoveFromArray(openSet, current)
		closedSet.push(current)
		const gridContent = document.querySelector('.grid__content').children
		var gridItem = gridContent[GetGridIndex(current.i, current.j)]
		gridItem.classList.toggle('open__node')
		gridItem.classList.toggle('closed__node')

		var neighbors = current.neighbors
		for (var neighbor of neighbors) {
			if (!closedSet.includes(neighbor)) {
				var tempG = current.g + 1
				if (tempG < neighbor.g) {
					neighbor.g = tempG
					neighbor.h = h(neighbor.i, neighbor.j, end.i, end.j)
					neighbor.f = neighbor.g + neighbor.h
					neighbor.previous = current

					if (!openSet.includes(neighbor)) {
						neighbor.g = tempG
						openSet.push(neighbor)
						gridItem = gridContent[GetGridIndex(neighbor.i, neighbor.j)]
						gridItem.classList.toggle('open__node')
					}
				}
			}
		}
	}

	function StartAStar() {
		var openSet = []
		var closedSet = []
		var start = grid[GetStartPos()[0]][GetStartPos()[1]]
		var end = grid[GetEndPos()[0]][GetEndPos()[1]]
		openSet.push(start)

		start.g = 0
		start.f = h(start.i, start.j, end.i, end.j)
		const gridContent = document.querySelector('.grid__content').children
		var gridItem = gridContent[GetGridIndex(start.i, start.j)]
		gridItem.classList.toggle('open__node')
		gridItem.classList.toggle('start__node')
		gridItem = gridContent[GetGridIndex(end.i, end.j)]
		gridItem.classList.toggle('end__node')
		var timer = setInterval(() => {
			RunAStar(openSet, closedSet, timer, end)
			if (openSet.length <= 0) {
				clearInterval(timer)
			}
		}, 15)
	}

	function UpdateNeighbors(i, j) {
		const gridItem = grid[i][j]
		var neighbors = []
		if (i - 1 >= 0) {
			//same column, one row down
			if (!IsWall(i - 1, j)) {
				neighbors.push(grid[i - 1][j])
			}
		}
		if (i + 1 < grid.length) {
			//same column, one row up
			if (!IsWall(i + 1, j)) {
				neighbors.push(grid[i + 1][j])
			}
		}
		if (j + 1 < grid[i].length) {
			//same row, one column to the right
			if (!IsWall(i, j + 1)) {
				neighbors.push(grid[i][j + 1])
			}
		}
		if (j - 1 >= 0) {
			//same row, one column to the left
			if (!IsWall(i, j - 1)) {
				neighbors.push(grid[i][j - 1])
			}
		}
		gridItem.neighbors = neighbors
	}

	function h(x1, x2, y1, y2) {
		return Math.abs(x1 - y1) + Math.abs(x2 - y2)
	}

	function addHWall(minX, maxX, y) {
		var hole = Math.floor(randomNumber(minX, maxX) / 2) * 2 + 1
		const gridContent = document.querySelector('.grid__content').children

		for (var i = minX; i <= maxX; i++) {
			if (i !== hole) {
				const temp = GetGridIndex(y, i)
				if (gridContent[temp].className === 'grid__item') {
					gridContent[temp].className = 'grid__item wall'
				}
			}
		}
	}

	function addVWall(minY, maxY, x) {
		var hole = Math.floor(randomNumber(minY, maxY) / 2) * 2 + 1
		const gridContent = document.querySelector('.grid__content').children

		for (var i = minY; i <= maxY; i++) {
			if (i !== hole) {
				const temp = GetGridIndex(i, x)
				if (gridContent[temp].className === 'grid__item') {
					gridContent[temp].className = 'grid__item wall'
				}
			}
		}
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min)
	}

	function GetGridIndex(currRow, currCol) {
		return numOfCols * currRow + currCol
	}

	function GenerateMaze() {
		ClearWalls()
		const gridContent = document.querySelector('.grid__content').children

		//Generate edges
		for (let i = 0; i < grid.length; i++) {
			for (let j = 0; j < grid[i].length; j++) {
				if (i === 0 || i === numOfRows - 1 || j === 0 || j === numOfCols - 1) {
					const temp = GetGridIndex(i, j)
					if (gridContent[temp].className === 'grid__item') {
						gridContent[temp].className = 'grid__item wall'
					}
				}
			}
		}

		Partition(true, 1, numOfCols - 2, 1, numOfRows - 2)
	}

	//generate grid
	useEffect(() => {
		let temp = []
		for (let i = 0; i < numOfRows; i++) {
			temp.push([])
			for (let j = 0; j < numOfCols; j++) {
				temp[i].push({
					f: Infinity,
					h: 0,
					g: Infinity,
					neighbors: undefined,
					previous: undefined,
					i: i,
					j: j,
				})
			}
		}
		setGrid(temp)
	}, [numOfCols, numOfRows, setGrid])

	// update grid cell size
	useEffect(() => {
		var gridContent = document.querySelector('.grid__content')

		var gap = parseFloat(
			window.getComputedStyle(gridContent, null).getPropertyValue('gap')
		)
		gap = Math.floor(gap)
		var minW = parseFloat(
			window
				.getComputedStyle(gridContent, null)
				.getPropertyValue('grid-template-rows')
		)

		var Wc = document.querySelector('.grid__content').offsetHeight
		setNumOfRows(Math.floor((Wc + gap) / (minW + gap)))

		window.addEventListener('resize', function () {
			Wc = document.querySelector('.grid__content').offsetHeight
			minW = parseFloat(
				window
					.getComputedStyle(gridContent, null)
					.getPropertyValue('grid-template-rows')
			)
			setNumOfRows(Math.floor((Wc + gap) / (minW + gap)))
		})
	}, [setNumOfRows])

	useEffect(() => {}, [numOfRows])

	return {
		allowedPathfinders,
		allowedSpeeds,
		currentPathfinder,
		UpdateCurrentPathfinder,
		currentSpeed,
		UpdateCurrentSpeed,
		grid,
		numOfCols,
		numOfRows,
		GenerateMaze,
		ClearWalls,
		StartVisualizer,
	}
}

export default usePathfinder
