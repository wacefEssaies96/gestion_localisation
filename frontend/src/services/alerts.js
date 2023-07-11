import Swal from "sweetalert2"
import { deleteData } from "./mix"

export const confirmDelete = (url, props) => {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            const res = await deleteData(url)
            props()
            Swal.fire(
                'Deleted!',
                res.message,
                'success'
            )
        }
    })
}

export const success = (message) => {
    Swal.fire(
        'Success !', message, 'success'
    )
}

export const errorAlert = (message) => {
    Swal.fire(
        'Error !', message, 'error'
    )
}