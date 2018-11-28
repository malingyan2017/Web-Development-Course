function createExercise(event) {
    var req = new XMLHttpRequest();
    var payload = { name: null, reps: null, weight: null, date: null, unit: null };
    payload.name = document.getElementById('name').value;
    payload.reps = document.getElementById('reps').value;
    payload.weight = document.getElementById('weight').value;
    payload.date = document.getElementById('date').value;

    var units = document.getElementsByName('unit');
    for (var unit of units) {
        if (unit.checked) {
            payload.unit = unit.value;
            break;
        }
    }

    req.open('POST', './createExercise');
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        if (req.status >= 200 && req.status < 400) {
            var resp = JSON.parse(req.responseText);
            if (resp.success) {
                var table = document.getElementById('workouts');
                var row = table.insertRow();

                var nameRow = row.insertCell(0);
                var name = document.createTextNode(payload.name);
                nameRow.appendChild(name);

                var repsRow = row.insertCell(1);
                var reps = document.createTextNode(payload.reps);
                repsRow.appendChild(reps);
                
                var weightRow = row.insertCell(2);
                var weight = document.createTextNode(payload.weight);
                weightRow.appendChild(weight);
                
                var dateRow = row.insertCell(3);
                var date = document.createTextNode(payload.date);
                dateRow.appendChild(date);
                
                var unitRow = row.insertCell(4);
                var unit = document.createTextNode(payload.unit == 1 ? 'lbs' : 'kg');
                unitRow.appendChild(unit);

                var deleteBtnRow = row.insertCell(5);
                var deleteBtn = document.createElement('button');
                deleteBtn.appendChild(document.createTextNode('Delete'));
                deleteBtn.addEventListener(
                    'click', 
                    () => deleteExercise(resp.id, deleteBtn)
                    //((id) => (() => deleteExercise(id, deleteBtn)))(resp.id)
                );
                deleteBtnRow.appendChild(deleteBtn);

                var editBtnRow = row.insertCell(6);
                var editBtn = document.createElement('button');
                editBtn.appendChild(document.createTextNode('Edit'));
                //deleteBtn.addEventListener('click', deleteExercise(resp.id, deleteBtn));
                editBtnRow.appendChild(editBtn);

                return;
            }
        }
        alert("fail to create exercise");
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
}

function deleteExercise(id, btn) {
    var req = new XMLHttpRequest();
    req.open("POST", "./deleteExercise");
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load',function(){
        if(req.status >= 200 && req.status < 400){
          var response = JSON.parse(req.responseText);
          if (response.success) {
            var table = document.getElementById("workouts");
            table.deleteRow(btn.parentNode.parentNode.rowIndex);
            return;
          }
        } 
        alert("fail to delete current row");
    });
    req.send(JSON.stringify({id: id}));
}