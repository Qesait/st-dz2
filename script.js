function submitForm() {
    let form = document.getElementById('Form');

    let n = parseInt(form.elements.n.value);
    if (isNaN(n)) {
        alert("Неверное значение для N");
        return false
    }
    let k = parseInt(form.elements.k.value);
    if (isNaN(k)) {
        alert("Неверное значение для K");
        return false
    }

    if (form.elements.m.value.length != k) {
        alert("Длина информационного вектора должна быть равна N")
        return false
    }
    let m = []
    for (let char of form.elements.m.value) {
        if (char !== '0' && char !== '1') {
            alert("Неверное значение для информационного вектора");
            return false
        }
        m.push(+char)
    }

    if (form.elements.g.value.length > (n - k + 1)) {
        alert("Длина порождающего вектора должна быть равна N")
        return false
    }
    let g = []
    for (let char of form.elements.g.value) {
        if (char !== '0' && char !== '1') {
            alert("Неверное значение для порождающего вектора");
            return false
        }
        g.push(+char)
    }

    console.log(n, k, m, g);
    let coded = code(m, g, n, k);

    let cyclic_code = document.getElementById("cyclic_code")
    cyclic_code.textContent = "Циклический [" + n.toString() + ", " + k.toString() + "]-код: " + deleteZeroes(coded).join('')

    let table = document.getElementById('Table').getElementsByTagName('tbody')[0];

    for (let i = 1; i <= n; i++) {
        let errors = 0
        let detected = 0
        generateErrors(n, i, (e) => {
            errors += 1
            if (checkError(coded, e, g)) {
                detected += 1
            }
        })
        let newRow = table.insertRow();

        let cell1 = newRow.insertCell(0);
        cell1.textContent = i.toString()
        let cell2 = newRow.insertCell(1);
        cell2.textContent = errors.toString()
        let cell3 = newRow.insertCell(2);
        cell3.textContent = detected.toString()
        let cell4 = newRow.insertCell(3);
        cell4.textContent = (detected / errors).toString()
    }

    return false; // Returning false prevents the form from submitting
}

function deleteZeroes(a) {
    for (let i = 0; i < a.length; i++) {
        if (a[i] === 1) {
            if (i !== 0) {
                a = a.slice(i)
            }
            break
        }
    }
    return a
}

function code(m, g, n, k) {
    let tmp = m.slice().concat(Array(n - k).fill(0));
    let reminder = divide(tmp, g)
    return m.slice().concat(reminder)
}

function divide(a, b) {
    for (let i = 0; i <= (a.length - b.length); i++) {
        if (a[i] === 0) {
            continue
        }
        for (let j = 0; j < b.length; j++) {
            a[i + j] = a[i + j] ^ b[j]
        }
    }
    return a.slice(-(b.length - 1))
}

function checkError(v, e, g) {
    let r = Array.from(v)
    for (let i = e.length; i > 0; i--) {
        r[r.length - i] = r[r.length - i] ^ e[e.length - i]
    }
    let s = divide(r, g)
    for (let i of s) {
        if (i !== 0) {
            return true
        }
    }
    return false
}

function generateErrors(n, k, callback) {
    function backtrack(current, onesCount, remainingZeros) {
        if (onesCount + remainingZeros === 0) {
            callback(current);
            return;
        }
        if (onesCount > 0) {
            backtrack(current.slice().concat([1]), onesCount - 1, remainingZeros);
        }
        if (remainingZeros > 0) {
            backtrack(current.slice().concat([0]), onesCount, remainingZeros - 1);
        }
    }
    backtrack([], k, n - k);
    return;
}