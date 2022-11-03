const API_END_POINT='http://34.100.155.118:8080/lms/api';
const pageSize = 8;
let page = 1;

getMembers();

function getMembers(query=`${$('#txt-search').val()}`){
    /* (1) Initiate a XMLHttpRequest object */
    const http = new XMLHttpRequest();

    /* (2) Set an event listener to detect state change */
    http.addEventListener('readystatechange', ()=> {
        if (http.readyState === http.DONE){
            $("#loader").hide();
            if (http.status === 200){
                const totalMembers = +http.getResponseHeader('X-Total-Count');
                initPagination(totalMembers);

                const members = JSON.parse(http.responseText);
                if (members.length === 0){
                    $('#tbl-members').addClass('empty');
                }else{
                    $('#tbl-members').removeClass('empty');
                }
                $('#tbl-members tbody tr').remove();
                members.forEach((member, index) => {
                    const rowHtml = `
                    <tr tabindex="0">
                        <td>${member.id}</td>
                        <td>${member.name}</td>
                        <td>${member.address}</td>
                        <td>${member.contact}</td>
                    </tr>
                    `;
                    $('#tbl-members tbody').append(rowHtml);
                });
            }else{
                showToast('Failed to load members, try refreshing again','warning');
            }
        }
    });

    /* (3) Open the request */
    http.open('GET', `${API_END_POINT}/members?size=${pageSize}&page=${page}&q=${query}`, true);

    /* (4) Set additional infromation for the request */

    /* (5) Send the request */
    http.send();
}

function initPagination(totalMembers){
    const totalPages = Math.ceil(totalMembers / pageSize);
    
    if (totalPages <= 1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');
    }

    let html = '';
    for(let i = 1; i <= totalPages; i++){
        html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`;
    }
    html = `
        <li class="page-item ${page === 1? 'disabled': ''}"><a class="page-link" href="#">Previous</a></li>
        ${html}
        <li class="page-item ${page === totalPages? 'disabled': ''}"><a class="page-link" href="#">Next</a></li>
    `;

    $('#pagination > .pagination').html(html);
}

$('#pagination > .pagination').click((eventData)=> {
    const elm = eventData.target;
    if (elm && elm.tagName === 'A'){
        const activePage = ($(elm).text());
        if (activePage === 'Next'){
            page++;
            getMembers();
        }else if (activePage === 'Previous'){
            page--;
            getMembers();
        }else{
            if (page !== activePage){
                page = +activePage;
                getMembers();
            }
        }
    }
});

$('#txt-search').on('input', () => {
    page = 1;
    getMembers();
});

$('#tbl-members tbody').keyup((eventData)=>{
    if (eventData.which === 38){
        const elm = document.activeElement.previousElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }else if (eventData.which === 40){
        const elm = document.activeElement.nextElementSibling;
        if (elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }
});

$(document).keydown((eventData)=>{
    if(eventData.ctrlKey && eventData.key === '/'){
        $("#txt-search").focus();
    }
});

$("#btn-new-member").click(()=> {
    const frmMemberDetail = new 
                bootstrap.Modal(document.getElementById('frm-member-detail'));

    $("#frm-member-detail")
        .addClass('new')
        .on('shown.bs.modal', ()=> {
            $("#txt-name").focus();
        });

    frmMemberDetail.show();
});

$("#frm-member-detail form").submit((eventData)=> {
    eventData.preventDefault();
    $("#btn-save").click();
});

$("#btn-save").click(async ()=> {

    const name = $("#txt-name").val();
    const address = $("#txt-address").val();
    const contact = $("#txt-contact").val();
    let validated = true;

    $("#txt-name, #txt-address, #txt-contact").removeClass('is-invalid');

    if (!/^\d{3}-\d{7}$/.test(contact)){
        $("#txt-contact").addClass('is-invalid').select().focus();
        validated = false;
    }

    if (!/^[A-Za-z0-9|,.:;#\/\\ -]+$/.test(address)){
        $("#txt-address").addClass('is-invalid').select().focus();
        validated = false;
    }

    if (!/^[A-Za-z ]+$/.test(name)){
        $("#txt-name").addClass('is-invalid').select().focus();
        validated = false;
    }

    if (!validated) return;

    try{
        $("#overlay").removeClass("d-none");
        const {id} = await saveMember();
        $("#overlay").addClass("d-none");
        showToast(`Member has been saved successfully with the ID: ${id}`, 'success');
        $("#txt-name, #txt-address, #txt-contact").val("");
        $("#txt-name").focus();
    }catch(e){
        $("#overlay").addClass("d-none");
        showToast("Failed to save the member, try again");
        $("#txt-name").focus();
    }
    
});

function saveMember(){
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.addEventListener('readystatechange', ()=> {
            if (xhr.readyState === XMLHttpRequest.DONE){
                if (xhr.status === 201){
                    resolve(JSON.parse(xhr.responseText));
                }else{
                    reject();
                }
            }
        });

        xhr.open('POST', `${API_END_POINT}/members`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        const member = {
            name: $("#txt-name").val(),
            address: $("#txt-address").val(),
            contact: $("#txt-contact").val()
            
        }

        xhr.send(JSON.stringify(member));

    });
}

function showToast(msg, msgType = 'warning'){
    $("#toast").removeClass('text-bg-warning')
        .removeClass('text-bg-primary')
        .removeClass('text-bg-error')
        .removeClass('text-bg-success');

    if (msgType === 'success'){
        $("#toast").addClass('text-bg-success');
    }else if (msgType === 'error'){
        $("#toast").addClass('text-bg-error');
    }else if(msgType === 'info'){
        $("#toast").addClass('text-bg-primary');
    }else {
        $("#toast").addClass('text-bg-warning');
    }

    $("#toast .toast-body").text(msg);
    $("#toast").toast('show');
}



$('#frm-member-detail').on('hidden.bs.modal',()=>{
    getMembers();
});


















// const pageSize=5;
// let page=1;
// getMembers();

// function getMembers(query=`${$('#txt-search').val()}`){
// /* (1) Initiate a XMLHttpRequest object */
// const http=new XMLHttpRequest();


// /* (2) set an event listener to detect state change  */
// http.addEventListener('readystatechange',()=>{
//     // console.log(http.readyState);
//     if(http.readyState===http.DONE){//1 ready state
//         if(http.status===200){// 2 state code
//             console.log("Response eka awa.. awa...awa....");
//             // console.log(http.responseXML);
//             const totalMembers= +http.getResponseHeader('X-Total-Count');
//             initPagination(totalMembers);
//             console.log(http.responseText);
//             const members=JSON.parse(http.responseText);
            
//             $('#loader').hide();
//             if(members.length===0){
//                 $('#tbl-members').addClass('empty');
//             }else{
//                 $('#tbl-members').removeClass('empty');

//             }
//             console.log(members);
//             $('#tbl-members tbody tr').remove();
//             members.forEach(member => {
//                 const rowHtml=`
//                 <tr tabindex="0">
//                     <td>${member.id}</td>
//                     <td>${member.name}</td>
//                     <td>${member.address}</td>
//                     <td>${member.contact}</td>

//                 </tr>
//                 `;
//                 $('#tbl-members tbody').append(rowHtml);
                
//             });
          

//         }else{
//             // console.error("Something went wrong");
//             // $('#toast').toast('show');
//             showToast('Failed to load members, try again','info');
//         }
//     }

// });

// /* (3) Open the request */
// // http.open('GET','https://c600f19b-cb76-4c53-a214-22ef9e66172f.mock.pstmn.io/members',true);
// // http.open('GET','http://localhost:8080/lms/api/members',true);
// http.open('GET',`http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}&q=${query}`,true);


// /* (4) Set additional information for the request */
// // details not provide here, meta data set


// /* (5) Send the request */
// http.send();
// // body send, file upload
// }

// function initPagination(totalMembers){
//     console.log(totalMembers);
//     const totalPages=Math.ceil(totalMembers/pageSize);
//     if(totalPages<=1){
//         $('#pagination').addClass('d-none');

//     }else{
//         $('#pagination').removeClass('d-none');

//     }
//     let html='';
//     for (let i = 1; i <= totalPages; i++) {
//         html+=` <li  class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`
       
//     }

//     html=`
//     <li  class="page-item ${page===1? 'disable':''}"><a class="page-link" href="#">Previous</a></li>
//     ${html}
   
//     <li  class="page-item ${page===totalPages? 'disable':''}"><a class="page-link" href="#">Next</a></li>
//     `;


//     $('#pagination > .pagination').html(html);

// }

// $('#pagination > .pagination').click((eventData)=>{
//     const elm=eventData.target;
//     if(elm && elm.tagName ==='A' ){
//         const activePage=($(elm).text());
//         if(activePage=== 'Next'){
//             page++;
//             getMembers();
//         } else if(activePage==='Previous') {
//             page--;
//             getMembers();
            
//         }else{
//             if(page !== activePage){
//                 page=+activePage;
//                 getMembers();
//             }
          
//         }
//     }
// });

// $('#txt-search').on('input',()=>{
//     console.log("working");
//     page=1;
//     getMembers();

// });

// $('#tbl-members tbody').keyup((eventData)=>{
//     // console.log(eventData.whitch);
//     if(eventData.which===38){
//         console.log('Up arrow key pressed');
//         const elm=document.activeElement.previousElementSibling;
//         if(elm instanceof HTMLTableRowElement){
//             elm.focus();
//         }

//     }else if(eventData.which===40){
//         const elm=document.activeElement.nextElementSibling;
//         if(elm instanceof HTMLTableRowElement){
//             elm.focus();
//         }
//     }
// });

// $(document).keydown((eventData)=>{
//     console.log(eventData);
//     if(eventData.ctrlKey && eventData.key==="/"){
//         $('#txt-search').focus();
//     }

// });

// $('#btn-new-member').click(()=>{
//     const frmMemberDetail = new bootstrap.Modal(document.getElementById('frm-member-detail'));
//     $('#frm-member-detail').addClass('new')
//     .on('shown.bs.modal',()=>{
//         $("#txt-name").focus();
//     });
//     frmMemberDetail.show();
    

// });


// $('#frm-member-detail form').submit((eventData)=> {
//     eventData.preventDefault();
//     $('#btn-save').click();

// });

// $('#btn-save').click(async()=>{

//     const name=$('#txt-name').val();
//     const address=$('#txt-address').val();
//     // const contact=$('#txt-contact').val();
//     const contact='';
  

//     let validated=true;

//     $('#txt-name ,#txt-address ,#txt-contact').removeClass('is-invalid');

//     if(!/^\d{3}-\d{7}$/.test(contact)){
//         $('#txt-contact').addClass('is-invalid').select().focus();
//         validated=false;
//     }

//     if(!/^[A-Za-z0-9# |,./\-:;]+$/.test(address)){ 
//         $('#txt-address').addClass('is-invalid').select().focus();
//         validated=false;

//     }
  
//     if(!/^[A-Za-z ]+$/.test(name)){
//         $('#txt-name').addClass('is-invalid').select().focus();
//         validated=false;

//     }

//     if(!validated) return;

//     try{
//         $('#overlay').removeClass('d-none');
//        const {id}= await saveMember();
//         $('#overlay').addClass('d-none');
//         showToast(`Member has been saved successfully with the ID: ${id}`,'success')
//         $('#txt-name, #txt-address, #txt-contact').val('');
//         $('#txt-name').focus();


//     }catch(e){
//         $('#overlay').addClass('d-none');
//         showToast("Failed to save the members, try again",'warning');
//         $('#txt-name').focus();

//     }

   




// });

// function saveMember(){

//     return new Promise((resolve,reject)=>{
//         const xhr=new XMLHttpRequest();

//         xhr.addEventListener('readystatechange',()=>{
//             if(xhr.readyState===XMLHttpRequest.DONE){
//                 if(xhr.status===201){
//                     resolve(JSON.parse(xhr.responseText));
//                 }else{
//                     reject();
//                 }

//             }
//         });

//         xhr.open('POST','http://localhost:8080/lms/api/members',true);

//         xhr.setRequestHeader('Content-Type','application/json');
//         const member={
//             name:$("#txt-name").val(),
//             address:$("#txt-address").val(),
//             contact:$("#txt-contact").val()
//         }


//         xhr.send(JSON.stringify(member));
  

//     });

// }

// function showToast(msg, msgType='warning'){

//     $('#toast').removeClass('text-bg-warning')
//     .removeClass('text-bg-primary')
//     .removeClass('text-bg-error')
//     .removeClass('text-bg-success');

//     if(msgType==='success'){
//         $('#toast').addClass('text-bg-success')
//     }else if(msgType==='error'){
//         $('#toast').addClass('text-bg-error')
//     }else if(msgType==='info'){
//         $('#toast').addClass('text-bg-primary')
//     }else {
//         $('#toast').addClass('text-bg-warning')
//     }
  
  
  
//     $('#toast .toast-body').text(msg);
//     $('#toast').toast('show');
// }

















// // function saveMember(){

// //     return new Promise((resolve,reject)=>{
// //         setTimeout(()=>reject(),2000);
// //         setTimeout(()=>resolve(),5000);

// //     });

// // }


// // doSomething(); 

// // async function doSomething(){

// //     try{
// //         await saveMember();
// //         console.log('Kiwwa wagem kala..');

// //     }catch(e){
// //         console.log('Promis eka kaleee..');

// //     }


// // }

// // function doSomething(){
// //     const promise=saveMember();
// // console.log(promise);

// // promise.then(()=>{
// //     console.log('Kiwwa wagem kala..');

// // }).catch(()=>{
// //     console.log('Promis eka kaleee..');

// // });


// // promise.then(()=>{
// //     console.log('Working');

// // }).catch(()=>{
// //     console.log('Awl');

// // });

// // }

