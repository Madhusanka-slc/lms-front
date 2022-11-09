// // const API_END_POINT='http://35.200.162.107:8080/lms/api';
// // const API_END_POINT='http://localhost:8080/lms/api';
// const pageSize = 8;
// let page = 1;

// // getBooks();

// function getBooks(query=`${$('#txt-search').val()}`){
//     /* (1) Initiate a XMLHttpRequest object */
//     const http = new XMLHttpRequest();

//     /* (2) Set an event listener to detect state change */
//     http.addEventListener('readystatechange', ()=> {
//         if (http.readyState === http.DONE){
//             $("#loader").hide();
//             if (http.status === 200){
//                 const totalBooks = +http.getResponseHeader('X-Total-Count');
//                 initPagination(totalBooks);
//                 console.log(http.responseText);

//                 const books = JSON.parse(http.responseText);
//                 if (books.length === 0){
//                     $('#tbl-books').addClass('empty');
//                 }else{
//                     $('#tbl-books').removeClass('empty');
//                 }
//                 $('#tbl-books tbody tr').remove();
//                 books.forEach((book, index) => {
//                     const rowHtml = `
//                     <tr tabindex="0">
//                         <td>${book.isbn}</td>
//                         <td>${book.title}</td>
//                         <td>${book.author}</td>
//                         <td>${book.copies}</td>
//                     </tr>
//                     `;
//                     $('#tbl-books tbody').append(rowHtml);
//                 });
//             }else{
//                 showToast('Failed to load books, try refreshing again','warning');
//             }
//         }
//     });

//     /* (3) Open the request */
//     http.open('GET', `${API_END_POINT}/books?size=${pageSize}&page=${page}&q=${query}`, true);

//     /* (4) Set additional infromation for the request */

//     /* (5) Send the request */
//     http.send();
// }

// function initPagination(totalBooks){
//     const totalPages = Math.ceil(totalBooks / pageSize);
//     if(page>totalPages){
//        page=totalPages
//        console.log(page);
//        if(page===0) page=1;
       
//        getBooks();
//        return;
//     }        
    
//     if (totalPages <= 1){
//         $("#pagination").addClass('d-none');
//     }else{
//         $("#pagination").removeClass('d-none');
//     }

//     let html = '';
//     for(let i = 1; i <= totalPages; i++){
//         html += `<li class="page-item ${i===page?'active':''}"><a class="page-link" href="#">${i}</a></li>`;
//     }
//     html = `
//         <li class="page-item ${page === 1? 'disabled': ''}"><a class="page-link" href="#">Previous</a></li>
//         ${html}
//         <li class="page-item ${page === totalPages? 'disabled': ''}"><a class="page-link" href="#">Next</a></li>
//     `;

//     $('#pagination > .pagination').html(html);
// }

// $('#pagination > .pagination').click((eventData)=> {
//     const elm = eventData.target;
//     if (elm && elm.tagName === 'A'){
//         const activePage = ($(elm).text());
//         if (activePage === 'Next'){
//             page++;
//             getBooks();
//         }else if (activePage === 'Previous'){
//             page--;
//             getBooks();
//         }else{
//             if (page !== activePage){
//                 page = +activePage;
//                 getBooks();
//             }
//         }
//     }
// });

// $('#txt-search').on('input', () => {
//     page = 1;
//     getBooks();
// });

// $('#tbl-books tbody').keyup((eventData)=>{
//     if (eventData.which === 38){
//         const elm = document.activeElement.previousElementSibling;
//         if (elm instanceof HTMLTableRowElement){
//             elm.focus();
//         }
//     }else if (eventData.which === 40){
//         const elm = document.activeElement.nextElementSibling;
//         if (elm instanceof HTMLTableRowElement){
//             elm.focus();
//         }
//     }
// });

// $(document).keydown((eventData)=>{
//     if(eventData.ctrlKey && eventData.key === '/'){
//         $("#txt-search").focus();
//     }
// });

// $("#btn-new-book").click(()=> {
//     const frmBookDetail = new 
//                 bootstrap.Modal(document.getElementById('frm-book-detail'));

//     $("#frm-book-detail")
//     .removeClass('edit')
//         .addClass('new')
//         .on('shown.bs.modal', ()=> {
//             $('#txt-isbn,#txt-title,#txt-author,#txt-copies').attr('disabled',false).val('');
//             $("#txt-title").focus();
//         });


//         frmBookDetail.show();
// });

// $("#frm-book-detail form").submit((eventData)=> {
//     eventData.preventDefault();
//     $("#btn-save").click();
// });




// $("#btn-save").click(async ()=> {

//     const title = $("#txt-title").val();
//     const author = $("#txt-author").val();
//     const copies = $("#txt-copies").val();
//     let validated = true;

//     $("#txt-title, #txt-author, #txt-copies").removeClass('is-invalid');

//     if (!/^\d+$/.test(copies)){
//         $("#txt-copies").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!/^[A-Za-z ]+$/.test(author)){
//         $("#txt-author").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!/^[A-Za-z ]+$/.test(title)){
//         $("#txt-title").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!validated) return;

//     try{
//         $("#overlay").removeClass("d-none");
//         const {isbn} = await saveBook();
//         $("#overlay").addClass("d-none");
//         showToast(`Book has been saved successfully with the ISBN: ${isbn}`, 'success');
//         $("#txt-title, #txt-author, #txt-copies").val("");
//         $("#txt-title").focus();
//     }catch(e){
//         $("#overlay").addClass("d-none");
//         showToast("Failed to save the book, try again");
//         $("#txt-title").focus();
//     }
    
// });

// function saveBook(){
//     console.log("Hi");
//     return new Promise((resolve, reject) => {
//         const xhr = new XMLHttpRequest();

//         xhr.addEventListener('readystatechange', ()=> {
//             if (xhr.readyState === XMLHttpRequest.DONE){
//                 if (xhr.status === 201){
//                     resolve(JSON.parse(xhr.responseText));
//                 }else{
//                     reject();
//                 }
//             }
//         });
//         console.log("Hee");

//         xhr.open('POST', `${API_END_POINT}/books`, true);
//         xhr.setRequestHeader('Content-Type', 'application/json');
//         console.log("Hee");

//         const book = {
//             title: $("#txt-title").val(),
//             author: $("#txt-author").val(),
//             copies: $("#txt-copies").val()
            
//         }
//         console.log("Hee");

//         xhr.send(JSON.stringify(book));

//     });
// }


// function showToast(msg, msgType = 'warning'){
//     $("#toast").removeClass('text-bg-warning')
//         .removeClass('text-bg-primary')
//         .removeClass('text-bg-error')
//         .removeClass('text-bg-success');

//     if (msgType === 'success'){
//         $("#toast").addClass('text-bg-success');
//     }else if (msgType === 'error'){
//         $("#toast").addClass('text-bg-error');
//     }else if(msgType === 'info'){
//         $("#toast").addClass('text-bg-primary');
//     }else {
//         $("#toast").addClass('text-bg-warning');
//     }

//     $("#toast .toast-body").text(msg);
//     $("#toast").toast('show');
// }



// $('#frm-book-detail').on('hidden.bs.modal',()=>{
//     getBooks();
// });


// $('#tbl-books tbody').click(({target})=>{
 
//     if(!target) return;

//     let rowElm=target.closest('tr');
//     console.log($(rowElm.cells[0]).text());

//     getBookDetails($(rowElm.cells[0]).text());

// });


// async function getBookDetails(bookId){
//     console.log("Hi");

//     try{
//         const response=await fetch(`${API_END_POINT}/books/${bookId}`);
//         if(response.ok){
//             const book=await response.json();
//             console.log(book)

//                 const frmBookDetail = new  
//                 bootstrap.Modal(document.getElementById('frm-book-detail'));
               


//                 $("#frm-book-detail")
//                 .removeClass('new')
//                 .removeClass('edit');

//                 $('#txt-isbn').attr('disabled','true').val(book[0].isbn);
//                 $('#txt-title').attr('disabled','true').val(book[0].title);
//                 $('#txt-author').attr('disabled','true').val(book[0].author);
//                 $('#txt-copies').attr('disabled','true').val(book[0].copies);
              
               

//                 frmBookDetail.show();

//         }else{
//             throw new Error(response.status);
//         }

//     }catch(error){
//         showToast('Failed to fetch the book details');

//     }


// }






// $('#btn-edit').click(()=>{
//     $('#frm-book-detail').addClass('edit');
//     $("#txt-title, #txt-author, #txt-copies").attr("disabled",false);
// });

// $('#btn-delete').click(async()=>{
//     $('#overlay').removeClass('d-none');

//     try{
//         const response=await fetch(`${API_END_POINT}/books/${$('#txt-isbn').val()}`,{method: "DELETE"});

//         if(response.status===204){
//             showToast('Book has been deleted successfully','success');
       
//             $('#btn-close').click();

//         }else{
//             throw new Error(response.status);
//         }

//     }catch(error){
//         showToast('Failed to delete book, try again');

//     }finally{
//         $('#overlay').addClass('d-none');
//     }
// });



// $('#btn-update').click(async()=>{

//     const title = $("#txt-title").val();
//     const author = $("#txt-author").val();
//     const copies = $("#txt-copies").val();
//     let validated = true;

//     $("#txt-title, #txt-author, #txt-copies").removeClass('is-invalid');

//     if (!/^\d+$/.test(contact)){
//         $("#txt-copies").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!/^[A-Za-z ]+$/.test(author)){
//         $("#txt-author").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!/^[A-Za-z ]+$/.test(title)){
//         $("#txt-title").addClass('is-invalid').select().focus();
//         validated = false;
//     }

//     if (!validated) return;

//     $('#overlay').removeClass('d-none');

//    try{
//     const response= await fetch(`${API_END_POINT}/books/${$('#txt-isbn').val()}`,
//     {
//         method: "PATCH",
//         headers: {
//             'Content-Type':'application/json'
//         },
//         body: JSON.stringify({
//             id:$('#txt-isbn').val(),
//             title,author,copies
//         })

//     });
//     if(response.status===204){
//         showToast("Book has been updated",'success');
//     }else{
//         throw new Error(response.status);
//     }
    

//    }catch(error){
//     showToast("Faild to update");
//    }finally{
//     $('#overlay').addClass('d-none');
//    }
 
    
// });



