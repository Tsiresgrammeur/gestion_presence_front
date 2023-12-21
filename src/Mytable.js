import DataTable from "react-data-table-component";

 function Mytable(){
    const columns =[
        {
            name:'Name',
            selector: row => row.name
        },
        {
            name:'Email',
            selector: row => row.email
        },
        {
            name:'Age',
            selector: row => row.age
        },
    ]
    const data =[
        {
            id:1,
            name:'tonton',
            email:'hola@gmail.com',
            age:'34'

        },
        {
            id:1,
            name:'tonton',
            email:'hola@gmail.com',
            age:'34'

        },
        {
            id:1,
            name:'tonton',
            email:'hola@gmail.com',
            age:'34'

        }
    ]

    return (
        <div className="container mt-5">

            <DataTable
            columns={columns}
            data={data}
            ></DataTable>

        </div>
    )
}

export default Mytable;
