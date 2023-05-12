import React, { useEffect } from "react"
import imgadd from "./img/add-list.svg"
import checkbtn from "./img/check.png"
import { FaTrashAlt } from "react-icons/fa"
import btnadd from "./img/add-btn2.png"
import CreatableSelect from "react-select/creatable"
import { useState } from "react"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from "react-big-calendar"
import "bootstrap/dist/css/bootstrap.min.css"
import axios from "axios"
import Swal from "sweetalert2"
import "./App.css"

import {
  Button,
  Form,
  FormControl,
  Card,
  Row,
  Col,
  Container,
  Modal,
} from "react-bootstrap"

import moment from "moment-timezone"

// Establecer la zona horaria de Moment a "America/Bogota"
moment.tz.setDefault("America/Bogota")

const localizer = momentLocalizer(moment)

const App = () => {
  const baseURL = process.env.REACT_APP_BASE_URL
  const [tasks, setTasks] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [options, setOptions] = useState([])
  const [showTask, setShowTask] = useState(false)
  const [id, setId] = useState()
  const [title, setTitle] = useState()
  const [description, setDescription] = useState()
  const [date, setDate] = useState()
  const [time, setTime] = useState()
  const [list, setList] = useState()
  const [status, setStatus] = useState()

  //registrar una tarea
  const AddTask = async (data) => {
    console.log(data)
    axios
      .post(`${baseURL}task/create`, {
        title: data.title.value,
        description: data.description.value,
        date: data.date.value,
        time: data.time.value,
        list: data.list.value,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Felicitationes...",
          text: "Tu tarea se ha agregado correctamente",
        })

        setShowTask(false)
        LoadTasks()
        clearData()
        data.reset()
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "lo sentimos...",
          text: "No hemos podido agregar tu tarea. Intentalo mas tarde",
        })
      })
  }

  //registrar una tarea
  const UpdateTask = async (data) => {
    axios
      .put(`${baseURL}task/update/${id}`, {
        title: data.title.value,
        description: data.description.value,
        date: data.date.value,
        time: data.time.value,
        list: {
          _id: data.list.value,
        },
        status: data.status.checked,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Felicitationes...",
          text: "Tu tarea se ha agregado correctamente",
        })

        setShowTask(false)
        clearData()
        data.reset()
        LoadTasks()
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "lo sentimos...",
          text: "No hemos podido agregar tu tarea. Intentalo mas tarde",
        })
      })
  }

  const DeleteTask = async (_id) => {
    axios
      .delete(`${baseURL}task/delete/${_id}`)
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Felicitationes...",
          text: "Tu tarea se ha eliminado correctamente",
        })
        LoadTasks()
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "lo sentimos...",
          text: "No hemos podido eliminar tu tarea. Intentalo mas tarde",
        })
      })
  }

  const handlerDeleteTask = async (_id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esta accion",
      icon: "warning",
      showCancelButton: true,
      cancelButtonColor: "#d33",
      confirmButtonColor: "#3085d6",
    }).then((result) => {
      if (result.isConfirmed) {
        DeleteTask(_id)
      }
    })
  }

  const clearData = () => {
    setId()
    setTitle()
    setDescription()
    setDate()
    setTime()
    setList()
    setStatus()
  }

  const AddList = async (_name) => {
    axios
      .post(`${baseURL}list/create`, {
        name: _name,
      })
      .then((res) => {
        Swal.fire({
          icon: "success",
          title: "Felicitationes...",
          text: "Tu lista se ha agregado correctamente",
        })
        LoadLists()
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "lo sentimos...",
          text: "No hemos podido crear tu lista. Intentalo mas tarde",
        })
      })
  }

  const handleCreate = (inputValue) => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      AddList(inputValue)
    }, 1000)
  }

  const events = tasks.map((task) => ({
    id: task._id,
    title: task.title,
    start: moment(`${task.date} ${task.time}`, "YYYY-MM-DD HH:mm").toDate(),
    end: moment(`${task.date} ${task.time}`, "YYYY-MM-DD HH:mm").add(1, "hour").toDate(),
    allDay: false,
  }))

  //consulta todas las tareas existentes
  const LoadTasks = () => {
    axios
      .get(`${baseURL}task/get`)
      .then((res) => {
        setTasks(res.data)
        console.log(res.data)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //consulta todas las tareas existentes
  const LoadDataTask = (_id) => {
    axios
      .get(`${baseURL}task/get/` + _id)
      .then((res) => {
        console.log(res.data)
        setTitle(res.data.title)
        setDescription(res.data.description)
        const fecha = new Date(res.data.date)
        const fechaRecortada = fecha.toISOString().slice(0, 10)
        setDate(fechaRecortada)

        const hora = res.data.time.slice(0, 5)
        setTime(hora)
        console.log(res.data.list._id)
        setList(
          res.data.list._id ? { value: res.data.list._id, label: res.data.list.name } : ""
        )
        setStatus(res.data.status)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  //consulta todas las tareas existentes
  const LoadLists = () => {
    axios
      .get(`${baseURL}list/get`)
      .then((res) => {
        setOptions(
          res.data.map((list) => {
            return { value: list._id, label: list.name }
          })
        )
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handlerAddTask = async (e) => {
    e.preventDefault()
    //Consume el servicio de crear tarea
    if (id) {
      UpdateTask(e.target)
    } else {
      AddTask(e.target)
    }
  }

  const handlerCreateTask = async (e) => {
    e.preventDefault()
    //Consume el servicio de actualizar tarea
    setShowTask(true)
  }

  function handlerUpdateTask(id) {
    console.log(id)
    setId(id)
    LoadDataTask(id)
    setShowTask(true)
  }

  useEffect(() => {
    moment.tz.setDefault("America/Bogota")
    LoadLists()
    LoadTasks()
  }, [])

  return (
    <Container fluid>
      <Row>
        <Col>
          <div className="d-flex justify-content-between  p-2">
            <h1>Tareas</h1>

            <a href="#" variant="btn-sm " onClick={handlerCreateTask}>
              <img src={btnadd} width="50%" className="task-img" alt="boton agregar" />
            </a>
          </div>

          <div className="d-flex flex-column flex-md-row p-4 gap-4 py-md-5 align-items-center justify-content-center">
            <div className="list-group ">
              {tasks.map((task) => {
                return (
                  <a
                    href="#"
                    style={task.status ? { backgroundColor: "#f8d57e" } : {}}
                    className={` cpt list-group-item list-group-item-action d-flex gap-3 py-3 mb-2 rounded border cardtask ${
                      status ? "cardbg-gold" : ""
                    }`}
                    aria-current="true"
                  >
                    <img
                      src={checkbtn}
                      alt="twbs"
                      width="32"
                      height="32"
                      className="rounded-circle flex-shrink-0"
                    />
                    <div className="d-flex gap-2 w-100 justify-content-between ">
                      <div onClick={(e) => handlerUpdateTask(task._id)}>
                        <h6 className="mb-0">{task.title}</h6>
                        <p className="mb-0 opacity-75">{task.description}</p>
                      </div>
                      <small className=" text-nowrap">
                        {task.time} <space></space>
                        <a href="#" onClick={(e) => handlerDeleteTask(task._id)}>
                          <FaTrashAlt />
                        </a>
                      </small>
                    </div>
                  </a>
                )
              })}
            </div>
          </div>
        </Col>
        <Col>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </Col>
      </Row>

      <Modal size="lg" show={showTask} name="Task">
        <Modal.Body>
          <Row>
            <Col
              md={6}
              className="d-flex justify-content-center align-content-center p-2"
            >
              <div className="mx-auto my-auto text-center">
                <img width="100%" src={imgadd} alt="wawd"></img>
              </div>
            </Col>
            <Col className="p-2">
              <Form onSubmit={handlerAddTask}>
                <Row>
                  <Col className="text-center">
                    <Form.Group className="mb-3">
                      <Card.Title className="fw-bold text-cente">
                        Registrar Tarea
                      </Card.Title>
                      <hr />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Titulo</Form.Label>
                      <FormControl
                        className="mb-3"
                        name="title"
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder=""
                        value={title}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Descripcion</Form.Label>
                      <FormControl
                        className="mb-3"
                        as="textarea"
                        name="description"
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        value={description}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Lista</Form.Label>
                      <CreatableSelect
                        name="list"
                        isClearable
                        isDisabled={isLoading}
                        isLoading={isLoading}
                        onChange={(newValue) => setList(newValue)}
                        onCreateOption={handleCreate}
                        options={options}
                        value={list}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Fecha</Form.Label>
                      <FormControl
                        className="mb-3"
                        type="date"
                        name="date"
                        placeholder=""
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Hora</Form.Label>
                      <FormControl
                        className="mb-3"
                        type="time"
                        name="time"
                        placeholder=""
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-bold">Estado</Form.Label>

                      <Form.Switch
                        className="mb-3"
                        style={{ width: "4em", height: "2em" }}
                        type="checkbox"
                        role="switch"
                        name="status"
                        onChange={(e) => {
                          setStatus(e.target.checked)
                        }}
                        checked={status}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group>
                  <div className="d-flex justify-content-between m-2">
                    <Button
                      variant="danger btn-sm"
                      onClick={(e) => {
                        setShowTask(false)
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button variant="btn-sm btn-block" className="btn-gold" type="submit">
                      Guardar
                    </Button>
                  </div>
                </Form.Group>
              </Form>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default App
