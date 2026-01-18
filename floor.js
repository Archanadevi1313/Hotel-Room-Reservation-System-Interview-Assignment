
const rooms = [];

// Floors 1 to 9 (10 rooms each)
for (let floor = 1; floor <= 9; floor++) {
  for (let i = 1; i <= 10; i++) {
    rooms.push({
      roomNumber: floor * 100 + i, 
      floor: floor,
      position: i,               
      isBooked: false
    });
  }
}

// Floor 10 
for (let i = 1; i <= 7; i++) {
  rooms.push({
    roomNumber: 1000 + i, 
    floor: 10,
    position: i,
    isBooked: false
  });
}


// Get all available rooms
function getAvailableRooms() {
  return rooms.filter(room => !room.isBooked);
}



//calculation horizontal and vertical time
function calculateGroupTime(group) {

  const floors = group.map(r => r.floor);
  const positions = group.map(r => r.position);

  const minPos = Math.min(...positions);
  const maxPos = Math.max(...positions);
  const horizontal = maxPos - minPos;
  const minFloor = Math.min(...floors);
  const maxFloor = Math.max(...floors);
  const vertical = (maxFloor - minFloor) * 2;

  return horizontal + vertical;
}



function findOptimalBooking(requiredRooms) {
  const available = getAvailableRooms();

  if (available.length < requiredRooms) {
    return null;
  }

  available.sort((a, b) => {
    if (a.floor === b.floor) {
      return a.position - b.position;
    }
    return a.floor - b.floor;
  });

  let bestGroup = null;
  let minTime = Infinity;

  for (let i = 0; i <= available.length - requiredRooms; i++) {
    const group = available.slice(i, i + requiredRooms);
    const time = calculateGroupTime(group);
 

    if (time < minTime) {
      minTime = time;
      bestGroup = group;
    }
  }
  return bestGroup;
}


function bookRooms(requiredRooms) {
  if (requiredRooms < 1 || requiredRooms > 5) {
    alert("You can book between 1 and 5 rooms only");
    return;
  }
  const selectedRooms = findOptimalBooking(requiredRooms);

  if (!selectedRooms) {
    alert("Not enough rooms available");
    return;
  }

  selectedRooms.forEach(room => room.isBooked = true);


}





function renderHotel() {
  const hotelDiv = document.getElementById("hotel");
  hotelDiv.innerHTML = "";

  for (let floor = 1; floor <= 10; floor++) {
    const floorDiv = document.createElement("div");
    floorDiv.className = "floor";

    const label = document.createElement("div");
    label.className = "floor-label";
    label.innerText = "Floor " + floor;

    const roomsDiv = document.createElement("div");
    roomsDiv.className = "rooms";

    const floorRooms = rooms.filter(r => r.floor === floor);

    floorRooms.forEach(room => {
      const roomDiv = document.createElement("div");
      roomDiv.className = "room " + (room.isBooked ? "booked" : "available");
      roomDiv.innerText = room.roomNumber;
      roomsDiv.appendChild(roomDiv);
    });

    floorDiv.appendChild(label);
    floorDiv.appendChild(roomsDiv);
    hotelDiv.appendChild(floorDiv);
  }
}


function handleBooking() {
  const count = parseInt(document.getElementById("roomCount").value);
  bookRooms(count);
  renderHotel();
}

function randomOccupancy() {
  rooms.forEach(room => {
    room.isBooked = Math.random() < 0.3; 
  });
  renderHotel();
}

function resetBooking() {
  rooms.forEach(room => room.isBooked = false);
  renderHotel();
}


renderHotel();