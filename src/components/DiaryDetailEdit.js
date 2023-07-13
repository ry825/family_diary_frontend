import React,{ useContext, useEffect , useState} from 'react'
import Modal from 'react-modal';
import {ApiContext} from '../context/ApiContext';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import TextField from '@mui/material/TextField';
import RemoveIcon from '@mui/icons-material/Remove';
import SaveIcon from '@mui/icons-material/Save';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const DiaryDetailEdit = () => {
    Modal.setAppElement('#root');
    const maxImageUpload = 10
    const maxVideoUpload = 5

    const handleEditPhoto = () => {
        const fileInput = document.getElementById('imageInput')
        fileInput.click()
    }

    const handleEditVideo = () => {
        const fileInput = document.getElementById('mp4Input')
        fileInput.click()
    }

    //非同期処理でプレビュー用の動画を表示させる
    const sleep = waitTime => new Promise( resolve => setTimeout(resolve, waitTime) );
    const handleLoad = async function() {
        await sleep(1)
        setIsLoaded(!isLoaded);
    };

    const handleVideoUpload = (event) => {
        // 動画ファイルが選択されている場合
        if (event.target.files && event.target.files.length > 0) {
            const newVideoList = editVideos
            newVideoList.push(event.target.files[0])
            setEditVideos(newVideoList)
            //非同期処理の関数呼び出し
            handleLoad()
        }
    }

    const handleOnRemoveImage = (index, id) => {
        const newPhotoList=[...editPhotos]
        newPhotoList.splice(index,1)
        setEditPhotos(newPhotoList)
        if(id){
            setDeletePhotoList([...deletePhotoList, id])
        }
    }

    const handleOnRemoveMp4 = (index, id) => {
        const newVideoList=[...editVideos]
        newVideoList.splice(index,1)
        setEditVideos(newVideoList)
        if(id){
            setDeleteVideoList([...deleteVideoList, id])
        }
    }

    const dialogOpen = (dialogType) => {
        setDialogOpenType(dialogType)
        setDialogIsOpen(true)
    }

    const journalOnChange = (event) => {
        if(event.target.value.length <= 500){
            setEditJournal(event.target.value)
        }
    }

    const titleOnChange = (event) => {
        if(event.target.value.length <= 30){
            setEditTitle(event.target.value)
        }
    }

    // 削除されたeventsアイテムをカレンダーから消すため非同期
    const deleteDiaryConfirm = async() => {
        setDeleteDialogIsOpen(false)
        await deleteDiary(diary.id)
        setDetailModalIsOpen(false);
        setDiaryList([])
        await getDiaries()
        setIsEditMode(false);
        setDeletePhotoList([]);
        setDeleteVideoList([]);
        setDiary([])
        setEditTitle(''); 
        setEditJournal('');
        setEditVideos([]);
        setEditPhotos([]);
        setDeletePhotoList([])
        setDeleteVideoList([])
        setPhotoList([])
        setVideoList([])
    }

    const {
        detailModalIsOpen,
        diary,
        alignment,
        photoEnlarge,
        selectedPhoto,
        isEditMode,
        editTitle,
        editJournal,
        editPhotos,
        editVideos,
        deleteVideoList,
        deletePhotoList,
        isLoaded,

        setIsLoaded,
        setDeletePhotoList,
        setDeleteVideoList,  
        setPhotoList,
        setVideoList,      
        setEditPhotos,
        setEditVideos,
        setEditJournal,
        setEditTitle,
        setIsEditMode,
        setPhotoEnlarge,
        setAlignment,
        setDiary,
        setDetailModalIsOpen,
        setDiaryList,

        cardMediaClick,
        editSave,
        getDetailDiary,
        deleteDiary,
        getDiaries,
        alignmentOnChange,
    } = useContext(ApiContext)

    const [dialogIsOpen, setDialogIsOpen] = useState(false)
    const [deleteDialogIsOpen, setDeleteDialogIsOpen] = useState(false)
    const [dialogOpenType, setDialogOpenType] = useState()
    
    // 編集モードか閲覧モードか判定,編集中の場合、保存、キャンセル時にダイアログ表示
    const dialogOpenJudge = (dialogType) => {
        if(isEditMode === true){
            dialogOpen(dialogType)
        }else{
            setDetailModalIsOpen(false); setAlignment('日記');  setIsEditMode(false); setDeletePhotoList([]); setDeleteVideoList([]); setDiary([])
        }
    }
    
    const editButtonClick = () => {
        if(isEditMode){
            dialogOpen('edit') 
        }else{
            setIsEditMode(!isEditMode);
        }
    }

    useEffect(() => {
        if(isEditMode){
            setEditTitle(diary.title); 
            setEditJournal(diary.journal);
            setEditPhotos(diary.related_picture);
            setEditVideos(diary.related_video)
            setPhotoList([editPhotos])
            setVideoList([editVideos])
        }else{
            setEditTitle(''); 
            setEditJournal('');
            setEditVideos([]);
            setEditPhotos([]);
            setDeletePhotoList([])
            setDeleteVideoList([])
            setPhotoList([])
            setVideoList([])
        }
    }, [isEditMode]);

return (
    <>  
        {diary &&
            <Modal 
                isOpen={detailModalIsOpen}
                onRequestClose={() => {dialogOpenJudge('cancel')}}
                style={{
                    overlay: {
                        zIndex: 1000,
                    },
                    content: {
                        zIndex: 1000,
                        width:'76%',
                        top: '8%',
                        left: '9%',
                        right: 'auto',
                        bottom: 'auto',
                        height:'80%'
                    },
                    inner: {
                        overflow: 'scroll'
                    }
                }}
            >
                {/* 編集モードで保存、キャンセル時に表示する確認のダイアログ */}
                {dialogOpenType === 'save' 
                    ?
                        (<Dialog open={dialogIsOpen}>
                            <DialogContent>
                                <DialogContentText>
                                    編集内容を保存しますか？
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions 
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button onClick={() => {setDialogIsOpen(false)}}>キャンセル</Button>
                                <Button onClick={() => {editSave(); setDialogIsOpen(false);}} autoFocus>保存する</Button>
                            </DialogActions>
                        </Dialog>)
                    : 
                        (<Dialog open={dialogIsOpen}>
                            <DialogContent>
                                <DialogContentText>
                                    編集中ですが、変更内容を破棄してもよろしいですか？
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions 
                                style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button onClick={() => {setDialogIsOpen(false)}} autoFocus>キャンセル</Button>
                                {dialogOpenType === 'edit'
                                    ?
                                        <Button onClick={() => {setAlignment('日記');  setIsEditMode(false); setDeletePhotoList([]); setDeleteVideoList([]); setDialogIsOpen(false); getDetailDiary(diary.id)}}>破棄する</Button>
                                    :
                                        <Button onClick={() => {setDetailModalIsOpen(false); setAlignment('日記');  setIsEditMode(false); setDeletePhotoList([]); setDeleteVideoList([]); setDialogIsOpen(false)}}>破棄する</Button>
                                }
                            </DialogActions>
                        </Dialog>)
                }

                {/* 削除確認のダイアログ */}
                <Dialog open={deleteDialogIsOpen}>
                    <DialogContent>
                        <DialogContentText>
                            日記を削除しますか?<br/>一度削除したら二度と復元できません。
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions 
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                        }}
                    >
                        <Button onClick={() => {setDeleteDialogIsOpen(false)}} autoFocus>キャンセル</Button>
                        <Button onClick={deleteDiaryConfirm}>削除する</Button>
                    </DialogActions>
                </Dialog>

                <IconButton
                    style={{
                        top: -15,
                        left: -15,
                        color: "#aaa",
                    }}
                    onClick={() => {dialogOpenJudge('cancel') }}
                >
                    <CancelIcon />
                </IconButton>
                <IconButton
                    style={{
                        top: -15,
                        float: 'right',
                        fontSize: '50%',
                    }}
                    color={isEditMode ? 'success' : "#666666"}
                    onClick={() => editButtonClick()}
                >
                    <EditIcon/>
                    {isEditMode == true && '編集中'}
                </IconButton>
                {isEditMode == true && 
                    <IconButton
                        style={{
                            top: -15,
                            float: 'right',
                            fontSize: '50%',
                            color: '#009688'
                        }}
                        onClick={() => {dialogOpenJudge('save')}}>
                        <SaveIcon/>
                        {isEditMode == true && '保存'}
                    </IconButton>
                }
                {isEditMode == true && 
                    <IconButton
                        style={{
                            top: -15,
                            float: 'right',
                            fontSize: '50%',
                        }}
                        color = 'error'
                        onClick={() => {setDeleteDialogIsOpen(true)}}>
                        <DeleteForeverIcon/>
                        {isEditMode == true && '削除'}
                    </IconButton>
                }



                <div className='toggle-button-group'>
                    <ToggleButtonGroup
                        color="primary"
                        value={alignment}
                        exclusive
                        onChange={alignmentOnChange}
                        aria-label="Platform"
                    >
                        <ToggleButton value="日記">日記</ToggleButton>
                        <ToggleButton value="写真">写真</ToggleButton>
                        <ToggleButton value="動画">動画</ToggleButton>
                    </ToggleButtonGroup>
                </div>
                <br/>
                {/* 閲覧モード */}
                {alignment === '日記' && isEditMode == false &&
                    <div>
                        <div style={{textAlign: 'center', marginBottom: '0.5em'}}>
                            <Typography style={{fontFamily: 'Oswald, sans-serif', fontSize:'2.2em'}}>{diary.title}</Typography>
                        </div>
                        <div>
                            <Typography variant="h6" style={{fontFamily: 'Oswald, sans-serif', whiteSpace: 'pre-line'}}>
                                {diary.journal}
                            </Typography>
                        </div>
                    </div>
                }
                {/* 編集モード */}
                {alignment === '日記' && isEditMode == true &&
                    <div>
                        <div className='title-name'>
                            <Typography>タイトル</Typography>
                        </div>
                        <div className='title'>
                            <TextField
                                value={editTitle}
                                type='text'
                                onChange={(event) => titleOnChange(event)}
                                style={{
                                    width:'80%'
                                }}
                            />
                        </div>
                        <br/>
                        <div className='title-name'>
                            <Typography>本文</Typography>
                        </div>
                        <div className='title'>
                            <TextField
                                value={editJournal}
                                type='text'
                                multiline
                                onChange={(event) => journalOnChange(event)}
                                style={{
                                    width:'80%'
                                }}
                            />
                        </div>
                    </div>
                }
                {/* 閲覧モード */}
                {/* 画像をプレビュー */}
                {alignment === '写真' && isEditMode == false &&
                    <div>
                        {diary.related_picture == 0 &&
                            <div 
                                style={{
                                    height: '10em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography style={{fontFamily: 'Oswald, sans-serif'}}>No Photos</Typography>
                            </div>
                        }
                        <Grid container>
                            {diary.related_picture && diary.related_picture.map((picture, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "relative",
                                        width: "50%",
                                        display: 'flex',
                                    }}
                                >
                                    <Grid item 
                                        style={{
                                            margin:'auto',
                                        }}
                                    >
                                    <CardMedia
                                        component="img"
                                        image={picture.picture}
                                        onClick={() => cardMediaClick(picture.picture)}
                                    />
                                    </Grid>
                                </div>
                            ))}
                        </Grid>
                    </div>
                }
                {/* 編集モードのとき */}
                {alignment === '写真' && isEditMode == true &&
                    <div>
                        {editPhotos && editPhotos.length >= maxImageUpload
                            ?
                                <IconButton onClick={handleEditPhoto} disabled>
                                    <AddPhotoAlternateIcon className='photo' />
                                </IconButton>
                            :
                                <IconButton onClick={handleEditPhoto}>
                                    <AddPhotoAlternateIcon className='photo' />
                                </IconButton>
                        }
                        {editPhotos == 0 &&
                            <div 
                                style={{
                                    height: '10em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography style={{fontFamily: 'Oswald, sans-serif'}}>No Photos</Typography>
                            </div>
                        }
                        
                        <input
                            type='file'
                            id='imageInput'
                            hidden='hidden'
                            accept="image/*,.png,.jpg,.jpeg,.gif"
                            onChange={(event) => {
                                const files = event.target.files;
                                if(files && files.length > 0) {
                                    setEditPhotos([...editPhotos, files[0]])
                                }
                            }}
                        />
                        <br/>
                        <Grid container>
                            {editPhotos && editPhotos[editPhotos.length-1] !== undefined && editPhotos.map((photo, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "relative",
                                        width: "50%",
                                        display: 'flex',
                                    }}
                                >
                                    <Grid item 
                                        style={{
                                            margin:'auto',
                                        }}
                                    >
                                        <IconButton
                                            style={{
                                                top: 6,
                                                left: -10,
                                                color: "#aaa",
                                            }}
                                            onClick={() => handleOnRemoveImage(i, photo.id)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                            
                                        {photo.id
                                            ?
                                                <CardMedia
                                                    component="img"
                                                    image={photo.picture}
                                                    onClick={() => cardMediaClick(photo.picture)}
                                                />
                                            :
                                                <CardMedia
                                                    component="img"
                                                    sx={{ width: 151 }}
                                                    image={URL.createObjectURL(photo)}
                                                    style={{
                                                        width: "85%",
                                                    }}
                                                />
                                        }
                                    </Grid>
                                </div>
                            ))}
                        </Grid>
                    </div>
                }
                {/* 閲覧モード */}
                {/* 動画をプレビュー */}
                {alignment === '動画' && isEditMode == false &&
                    <div>
                        {diary.related_video == 0 &&
                            <div 
                                style={{
                                    height: '10em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography style={{fontFamily: 'Oswald, sans-serif'}}>No Videos</Typography>
                            </div>
                        }
                        <Grid container>
                            {diary.related_video && diary.related_video.map((video, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "relative",
                                        width: "50%",
                                        display: 'flex',
                                    }}
                                >
                                    <Grid item 
                                        style={{
                                            margin:'auto'
                                        }}
                                    > 
                                    <CardMedia
                                        component="video"
                                        controls
                                        image={video.video}
                                    />
                                    </Grid>
                                </div>
                            ))}
                        </Grid>
                    </div>
                }
                {/* 編集モード */}
                {alignment === '動画' && isEditMode == true &&
                    <div>
                        {editVideos && editVideos[editVideos.length-1] !== undefined && editVideos.length >= maxVideoUpload
                            ?
                                <IconButton onClick={handleEditVideo} disabled>
                                    <LibraryAddIcon className='video' />
                                </IconButton>
                            :
                                <IconButton onClick={handleEditVideo}>
                                    <LibraryAddIcon className='video' />
                                </IconButton>
                        }
                        {editVideos == 0 &&
                            <div 
                                style={{
                                    height: '10em',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <Typography style={{fontFamily: 'Oswald, sans-serif'}}>No Videos</Typography>
                            </div>
                        }
                        <input
                            type='file'
                            id='mp4Input'
                            hidden='hidden'
                            accept="video/*"
                            onChange={handleVideoUpload}
                        />
                        <br/>
                        <Grid container>
                            {editVideos && editVideos.map((video, i) => (
                                <div
                                    key={i}
                                    style={{
                                        position: "relative",
                                        width: "50%",
                                        display: 'flex',
                                    }}
                                >
                                    <Grid item 
                                        style={{
                                            margin:'auto'
                                        }}
                                    >
                                        <IconButton
                                        style={{
                                            top: 6,
                                            left: -10,
                                            color: "#aaa",
                                        }}
                                        onClick={() => handleOnRemoveMp4(i, video.id)}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        {video.id
                                            ?
                                                <CardMedia
                                                    component="video"
                                                    controls
                                                    image={video.video}
                                                />
                                            :
                                                <CardMedia
                                                    component="video"
                                                    controls
                                                    sx={{ Width: 151 }}
                                                    image={URL.createObjectURL(video)}
                                                    style={{
                                                        width: "85%",
                                                    }}
                                                />
                                        }
                                    </Grid>
                                </div>
                            ))}
                        </Grid>
                    </div>
                }
            </Modal>
        }
        <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center'}}>
            <Modal 
                isOpen={photoEnlarge}
                onRequestClose={() => {setPhotoEnlarge(false);}}
                style={{
                    overlay: {
                        zIndex: 2000,
                    },
                    content: {
                        zIndex: 2000,
                        height: 'auto',
                    },
                }}
            >
                <IconButton
                    style={{
                        top: -15,
                        left: -15,
                        color: "#aaa",
                    }}
                    onClick={() => setPhotoEnlarge(false)}
                >
                    <CancelIcon />
                </IconButton>
                <div style={{display: 'flex',alignItems: 'center', justifyContent: 'center'}}>
                    <img style={{maxWidth:'100%', maxHeight:'100%'}} src={selectedPhoto}/>
                </div>
            </Modal>
        </div>
    </>
)
}

export default DiaryDetailEdit