import * as React from 'react';
import './style.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import BlockIcon from '@mui/icons-material/Block';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const LightButton = styled(Button)(({ theme }) => ({
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
  },
}));

function Body() {
  let [title, setTitle] = React.useState('');
  let [description, setDescription] = React.useState('');
  const [value, setValue] = React.useState(dayjs()); //this is the deadline variable
  let [priority, setPriority] = React.useState('low');
  let [isComplete, setIsComplete] = React.useState(false);
  let [toDoList, setToDoList] = React.useState([]);
  let [open, setOpen] = React.useState(false);
  let [titleValidatorMessage, setTitleValidatorMessage] = React.useState('');
  let [descriptionValidatorMessage, setDescriptionValidatorMessage] =
    React.useState('');
  let [index, setIndex] = React.useState(0);
  let [test, setTest] = React.useState('not working');
  let [update, setUpdate] = React.useState(false);
  const [toast1, setToast1] = React.useState(false);
  let [message, setMessage] = React.useState('');

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  const handleToastOpen = (notif) => {
    setToast1(true);
    setMessage(notif);
  };
  const handleToastClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setToast1(false);
  };

  let handleClickOpen = (updateButton) => {
    if (updateButton) {
      setUpdate(true);
    } else {
      setUpdate(false);
    }
    setOpen(true);
  };

  let handleUpdateOpen = (title) => {
    let index = findIndexByTitle(title);
    let task = toDoList[index];
    setTitle(title);
    setDescription(task.description);
    setValue(task.deadline);
    setPriority(task.priority);
  };

  let handleClose = () => {
    setOpen(false);
  };

  let handleTitleChange = (value) => {
    setTitle(value);
    validateTitle(value);
  };

  let handleDescriptionChange = (value) => {
    setDescription(value);
    validateDescription(value);
  };

  let validateTitle = (value) => {
    if (!value) {
      setTitleValidatorMessage('Title is required!');
    } else {
      let index = findIndexByTitle(value);
      if (index < 0) {
        //title is not in the table & is valid
        setTitleValidatorMessage('');
      } else {
        setTitleValidatorMessage('Duplicate title!');
      }
    }
  };

  let validateDescription = (value) => {
    //have to check if title is unique
    if (!value) {
      setDescriptionValidatorMessage('Description is required!');
    } else {
      setDescriptionValidatorMessage('');
    }
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  let findIndexByTitle = (title) => {
    const isCorrectTitle = (element) => element.title == title;
    return toDoList.findIndex(isCorrectTitle);
  };

  let handleCheckChange = (title) => {
    let index = findIndexByTitle(title);
    if (toDoList[index].isComplete) {
      //unchecked
      toDoList[index].isComplete = false;
      setTest('unchecked');
    } else {
      //checked
      toDoList[index].isComplete = true;
      setTest('checked');
    }
  };

  let deleteTasks = (title) => {
    let index = findIndexByTitle(title);
    let temp = toDoList;
    temp.splice(index, 1);
    handleToastOpen('Task deleted successfully!');
    setToDoList(temp);
    setTest(index);
  };

  function handleAdd() {
    let submit = true;
    if (title == '') {
      setTitleValidatorMessage('Title is required!');
      submit = false;
    }
    if (description == '') {
      //no description
      setDescriptionValidatorMessage('Description is required!');
      submit = false;
    }
    if (submit && titleValidatorMessage == '') {
      //no errors
      let task = {
        title: title,
        description: description,
        deadline: value,
        priority: priority,
        isComplete: false,
        index: index,
      };
      if (update) {
        let index = findIndexByTitle(title);
        toDoList[index] = task;
        handleToastOpen('Task updated successfully!');
      } else {
        toDoList.push(task);
        handleToastOpen('Task added successfully!');
      }
      setTitle('');
      setDescription('');
      setValue(dayjs());
      setPriority('low');
      setIndex(index + 1);
      handleClose();
    }
  }

  return (
    <div>
      {/* toasts */}
      <Snackbar
        open={toast1}
        autoHideDuration={6000}
        onClose={handleToastClose}
      >
        <Alert
          onClose={handleToastClose}
          severity="success"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* top bar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'center', position: 'relative' }}>
            <MenuIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div">
              FRAMEWORKS
            </Typography>
            <div className="rightPosition">
              {' '}
              <div>
                <LightButton onClick={(e) => handleClickOpen(false)}>
                  <AddCircleIcon fontSize="string" />
                  Add
                </LightButton>
              </div>
            </div>
          </Toolbar>
        </AppBar>
      </Box>
      <Dialog open={open} onClose={handleClose} maxWidth="xs">
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'left', position: 'relative' }}>
            {update ? (
              <EditIcon sx={{ mr: 1 }} />
            ) : (
              <AddCircleIcon sx={{ mr: 1 }} />
            )}
            <Typography variant="h6" component="div">
              {update ? 'Edit Task' : 'Add Task'}
            </Typography>
          </Toolbar>
        </AppBar>
        <DialogContent>
          <Box component="form" noValidate autoComplete="off">
            {update ? (
              <div />
            ) : (
              <TextField
                error={titleValidatorMessage}
                helperText={titleValidatorMessage}
                margin="normal"
                fullWidth
                required
                id="Title"
                label="Title"
                defaultValue=""
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            )}
            <TextField
              error={descriptionValidatorMessage}
              helperText={descriptionValidatorMessage}
              margin="normal"
              fullWidth
              required
              id="Description"
              label="Description"
              defaultValue=""
              value={description}
              onChange={(e) => handleDescriptionChange(e.target.value)}
            />
            <Box mt={2}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Deadline"
                  inputFormat="MM/DD/YYYY"
                  value={value}
                  onChange={handleChange}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Box>
            <Box mt={2}>
              <FormControl>
                <FormLabel id="priority">Priority</FormLabel>
                <RadioGroup
                  row
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <FormControlLabel
                    value="low"
                    control={<Radio />}
                    label="Low"
                  />
                  <FormControlLabel
                    value="med"
                    control={<Radio />}
                    label="Med"
                  />
                  <FormControlLabel
                    value="high"
                    control={<Radio />}
                    label="High"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleAdd}>
            {update ? (
              <EditIcon sx={{ mr: 1 }} />
            ) : (
              <AddCircleIcon sx={{ mr: 1 }} />
            )}
            {update ? 'Edit' : 'Add'}
          </Button>
          <Button color="error" variant="contained" onClick={handleClose}>
            <BlockIcon sx={{ mr: 1 }} />
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="center">Title</TableCell>
              <TableCell align="center">Description</TableCell>
              <TableCell align="center">Deadline</TableCell>
              <TableCell align="center">Priority</TableCell>
              <TableCell align="center">Is Complete</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {toDoList.map((row) => (
              <TableRow
                key={row.title}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell align="center">{row.title}</TableCell>
                <TableCell align="center">{row.description}</TableCell>
                <TableCell align="center">
                  {row.deadline.format('MM/DD/YY')}
                </TableCell>
                <TableCell align="center">{row.priority}</TableCell>
                <TableCell align="center">
                  <input
                    type="checkbox"
                    checked={row.isComplete}
                    onChange={(e) => handleCheckChange(row.title)}
                  ></input>
                </TableCell>
                <TableCell align="center">
                  {!row.isComplete ? (
                    <div>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleUpdateOpen(row.title);
                          handleClickOpen(true);
                        }}
                      >
                        &nbsp; <EditIcon sx={{ mr: 1 }} />
                        Update
                      </Button>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <div>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={(e) => deleteTasks(row.title)}
                    >
                      &nbsp;
                      <ClearIcon sx={{ mr: 1 }} /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default function App() {
  return (
    <div>
      <Body />
    </div>
  );
}
