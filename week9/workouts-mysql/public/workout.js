function createExercise(event) {
    var req = new XMLHttpRequest();
    var payload = { name: null, reps: null, weight: null, date: null, unit: null };
    var nameInput = document.getElementById('name');
    if (!nameInput.validity.valid) {
        alert('name is required');
        event.preventDefault();
        return;
    }
  
    payload.name = nameInput.value;
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
                var editForm = document.createElement('form');
                editForm.method = 'get';
                editForm.action = '/edit';

                var hiddenId = document.createElement('input');
                hiddenId.type = 'hidden';
                hiddenId.id = 'id';
                hiddenId.name = 'id';
                hiddenId.value = resp.id;
                editForm.appendChild(hiddenId);

                var hiddenName = document.createElement('input');
                hiddenName.type = 'hidden';
                hiddenName.id = 'name';
                hiddenName.name = 'name';
                hiddenName.value = payload.name;
                editForm.appendChild(hiddenName);

                var hiddenReps = document.createElement('input');
                hiddenReps.type = 'hidden';
                hiddenReps.id = 'reps';
                hiddenReps.name = 'reps';
                hiddenReps.value = payload.reps;
                editForm.appendChild(hiddenReps);

                var hiddenWeight = document.createElement('input');
                hiddenWeight.type = 'hidden';
                hiddenWeight.id = 'weight';
                hiddenWeight.name = 'weight';
                hiddenWeight.value = payload.weight;
                editForm.appendChild(hiddenWeight);

                var hiddenDate = document.createElement('input');
                hiddenDate.type = 'hidden';
                hiddenDate.id = 'date';
                hiddenDate.name = 'date';
                hiddenDate.value = payload.date;
                editForm.appendChild(hiddenDate);

                var hiddenUnit = document.createElement('input');
                hiddenUnit.type = 'hidden';
                hiddenUnit.id = 'unit';
                hiddenUnit.name = 'unit';
                hiddenUnit.value = payload.unit;
                editForm.appendChild(hiddenUnit);

                var editBtn = document.createElement('button');
                editBtn.type = 'submit';
                editBtn.appendChild(document.createTextNode('Edit'));
                editForm.appendChild(editBtn);
                editBtnRow.appendChild(editForm);

                return;
            }
        }
        alert("fail to create exercise");
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();
}

function updateExercise(event) {
    var req = new XMLHttpRequest();
    var payload = { id: null, name: null, reps: null, weight: null, date: null, unit: null };
    payload.id = document.getElementById('id').value;

    var nameInput = document.getElementById('name');
    if (!nameInput.validity.valid) {
        alert('name is required');
        event.preventDefault();
        return;
    }
    payload.name = nameInput.value;
    
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

    req.open('POST', './updateExercise');
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function() {
        let msg = 'unknown error';
        if (req.status >= 200 && req.status < 400) {
            var resp = JSON.parse(req.responseText);
            if (resp.success) {
                window.location.replace("/");
                return;
            } 
            msg = resp.reason;
        }
        alert("fail to update exercise: " + msg);
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