import React from 'react';
import './css/post.css';
import './css/base.css'

function Post() {
    return (
        <div className='post'>
            <div className='post__name'>
                <h1 className='post__name-main'>Các Tổ</h1>
            </div>
            <div className='post__container'>
                <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://i.ibb.co/DCD03J7/189adb1d-d4f1-4449-8cd3-69add86efa75.jpg" width= "300px" height="250px"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Tổ Nhà Trẻ-Mầm Chồi</h1>
                        <p className='post__container-main-text-child'>
                        Tổ Lá
                        </p>
                    </div>
                </div>
                <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://i.ibb.co/DCD03J7/189adb1d-d4f1-4449-8cd3-69add86efa75.jpg" width= "300px" height="250px"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Tổ Lá</h1>
                        <p className='post__container-main-text-child'>
                        xxxxxxxxx
                        </p>
                    </div>
                </div>
                <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://i.ibb.co/DCD03J7/189adb1d-d4f1-4449-8cd3-69add86efa75.jpg" width= "300px" height="250px"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Tổ Văn Phòng</h1>
                        <p className='post__container-main-text-child'>
                        ABCXYZ
                        </p>
                    </div>
                </div>
                <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://i.ibb.co/DCD03J7/189adb1d-d4f1-4449-8cd3-69add86efa75.jpg" width= "300px" height="250px"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Tổ Nuôi</h1>
                        <p className='post__container-main-text-child'>
                        ABCXYZ
                        </p>
                    </div>
                </div>
                {/* <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://www.mioto.vn/static/media/thue_xe_tu_lai_gia_re_hcm.ffd1319e.svg"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Giao xe tận nơi</h1>
                        <p className='post__container-main-text-child'>
                        Bạn có thể lựa chọn giao xe tận nhà/sân bay... Phí tiết kiệm chỉ từ 15k/km.
                        </p>
                    </div>
                </div>
                <div className='post__container-main'>
                    <div className='post__container-main-img'>
                        <img src="https://www.mioto.vn/static/media/thue_xe_tu_lai_gia_re_hanoi.4035317e.svg"></img>
                    </div>
                    <div className='post__container-main-text'>
                        <h1 className='post__container-main-text-title'>Dòng xe đa dạng</h1>
                        <p className='post__container-main-text-child'>
                        Hơn 100 dòng xe cho bạn tuỳ ý lựa chọn: Mini, Sedan, CUV, SUV, MPV, Bán tải.
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    )
}

export default Post
