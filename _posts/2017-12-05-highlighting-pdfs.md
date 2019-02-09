---
layout: post
title: Optimizing PDF organization and annotation
description: My workflow I developed for stress-free note taking.
---

# Optimizing PDF organization and annotation

I am a graduate student and I often have to read many PDFs. This post is about a few small programs I wrote to both get around bottlenecks using Mendeley to manage my pdfs, and keep track of annotations I make within those PDFs.

## PDF naming scheme

One aspect of downloaded scientific articles that gets on my nerves is the fact that they usually have very obscure names, such as `mmc5.pdf`, which makes it difficult to browse for specific PDFs based on file name. [Mendeley](https://www.mendeley.com), a program that can organize the articles you collect throughout your research, can help with this problem. When a pdf is imported into mendeley, it parses the article’s metadata if available, and updates a local database containing your imported articles with the information. Mendeley has an option to watch folders on your computer for newly added PDFs/files, allowing you to automatically import PDFs when you save them to a specific folder (i.e. your downloads folder). It also comes with a useful feature (called `file organizer`) to back up imported PDFs to a folder of your choice with a naming scheme based on the article’s metadata. For instance, you can ask Mendeley to rename the PDF with the paper’s title, the author’s names, the journal the paper was published in, or the year the article was published, making it easier to find PDFs just based on their name. For instance, `mmc5.pdf` could be renamed to: `A motor cortex circuit for motor planning and movement - Li et al. - Nature - 2015.pdf`. Why do I think these features are important?

- I read a lot on mobile devices, and would prefer to use other apps than Mendeley to read with. Therefore, a reasonable file naming scheme is desired.
- Combining the right tools with Mendeley can make PDF importing and annotation very powerful, as described below.

## Dropbox integration

Mendeley has a business model where they offer 2GB free storage space on their servers for the PDFs linked to the articles you accumulate, and then paid tiers where they offer more storage space. It can sync the articles between devices. Pretty quickly you will probably hit the upload limit with the free tier. I did not want to pay for a version of Mendeley where the only difference was more storage space online. As a solution, I use Dropbox to sync my PDFs between devices. I can tell Mendeley’s file organizer to save the processed PDFs in a Dropbox folder (you can also use google drive, or any other cloud storage service). This allows me to sync well-named PDFs between all devices, allowing them to be easily searchable. Dropbox’s searching capabilities are very strong - they even search within the PDFs for search terms you provide.

Sometimes I find an article on my mobile device that I would like to save to read, but I also want the article to be processed by Mendeley. To do this, I can have Mendeley watch a folder within Dropbox on my desktop computer, and send the processed PDF to another folder within Dropbox. So when I find an article on my mobile device, I can upload the PDF directly to the folder that Mendeley watches, and wait for Mendeley on my desktop computer to process the file. The processed file will show up in the processed folder momentarily.
My PDF importing pipeline looks like this:

- **Import folder (to watch by Mendeley)**: `/Users/wgillis/Dropbox/papers to read/`
- **Export folder (where Mendeley exports processed PDFs):** `/Users/wgillis/Dropbox/mendeley/`

### Managing Dropbox space

This type of PDF management uses up twice the amount of space than normal, because you have two folders, each containing the same PDFs. One folder has the PDFs you imported, while the other contains the PDFs that Mendeley has renamed and exported. I didn’t like the increase in storage space, so I used this as an opportunity to do two things:

1. make a program that watched new files within the Mendeley export folder
2. learn a new programming language for fun (golang)

The program ([found here](https://github.com/wingillis/mendeley-watcher)) detects when new PDFs are added to a user-supplied folder path, and deletes a copy of the same file from another user-supplied folder path. I set it to watch the folder Mendeley exports its files to, and to delete files from the folder I put new PDFs into. This poses an interesting problem: how do I know which two files are the same? I can’t use their file names, because they have changed. One option is to compare two files byte-by-byte. If I have to go through every file, I start using a large amount of disk resources. Another option is to compare a small chunk of each file. This reduces the amount of disk usage the program uses, and still provides a reasonably accurate comparison of similarity.

## Highlighting and annotations

Another part of the PDF workflow I wanted to automate/optimize is the note-taking and annotations in the PDF. I like to read and highlight PDFs on my iPad, using the app Notability. I also wanted to figure out a way I could keep track of all the highlights that I make in an article. One requirement was to be able to parse different highlight colors, because I use different color highlight to mean different things (i.e. yellow means ‘remember this’ and blue means ‘read this reference later’). To do this, I used a combination of 4 different tools to decrease the amount of time I have to spend bookkeeping and decrease the amount of effort I need to spend finding a piece of information. The 4 tools are:

- Notability (its auto-backup features)
- Evernote (its API)
- [imagemagick](https://www.imagemagick.org/script/index.php)
- python (its [image processing libraries](http://scikit-image.org/docs/dev/api/skimage.html), among other libraries)

I set up the tools so that I can create highlighted text in Notability, and I sync the highlighted text, along with the corresponding PDF into a dedicated Evernote notebook. Setting it up looks something like this:

- Use Notability’s auto-backup feature to sync PDFs that you’ve modified in the app (by note-taking or highlights) into a folder in any of the online storage services the app supports.
- Create an Evernote notebook where you’d like to upload the PDFs and highlighted regions (i.e. called Notability PDFs).
- Acquire a developer token from Evernote for your account (by going to [this link](https://www.evernote.com/api/DeveloperToken.action))
- Install imagemagick onto your desktop (if on mac, `brew install imagemagick`)
- Install python (via [Anaconda](https://www.anaconda.com/download), preferrably) and install the following libraries:
  - `pip install skimage`
  - `pip install evernote` (if using python3, the installation process is slightly more involved. Instead of `pip install evernote`, download/clone [this repo](https://github.com/evernote/evernote-sdk-python3), navigate to the directory, and run `pip install -e .`)
  - `pip install numpy`
  - `pip install scipy`
- Download this repository: notability-uploader - its job is to watch the Notability backup folder for newly modified PDFs, find the regions of the PDF that you highlighted, organize the highlights, and send the highlights, along with the PDF, to your Evernote notebook.
- Set up some type of daemon to run the notability-uploader. Options include using `launchd`, `cron` jobs, manually running the script from time to time, or something else.

### Highlight detection

Originally, I wanted to detect highlighted annotations directly in the PDF file, by parsing the data's tree structure.
However, Notability’s output file structure is a little more complicated than that. As a workaround, I look for the specific color of the highlighter I used within the document. To do this, I convert the PDF into one `png` image per page, then find pixels within the image that are closest to the highlighter color in colorspace, and extract that region of the image.

<figure>
<img src="https://d2mxuefqeaa7sj.cloudfront.net/s_C1CBA85C0F3ADE8D7493EBAFD81890EA7E72F14A432FAD5DD63CA577BB5C63F7_1512538979310_test0-1.png">
<figcaption>
Fig 1: Example highlighted page
</figcaption>
</figure>

For example, above is a highlighted page from an article (Fig 1). The yellow highlight is to remember for later, while the blue is to read/research later. The `notability-upload` program will detect the regions these highlights exist and crop them into a new Evernote note (Fig 2), with the included PDF for reference. One nice thing about Evernote is that it will perform optical character recognition (OCR) on any images in your notes (if you have Premium). This allows you to search for a word specifically in the highlighted regions. An additional use case for highlighting is to quickly save snippets of a paper. For instance, if there is a chart you’d like to keep in easy access, you could highlight a box around the chart, and it will automatically be grabbed (Fig 3).

<figure>
<img src="https://d2mxuefqeaa7sj.cloudfront.net/s_C1CBA85C0F3ADE8D7493EBAFD81890EA7E72F14A432FAD5DD63CA577BB5C63F7_1512539215856_Screen+Shot+2017-12-06+at+12.46.26+AM.png">
<figcaption>
Fig 2: Structure of the Evernote note
</figcaption>
</figure>

<figure>
<img src="https://d2mxuefqeaa7sj.cloudfront.net/s_C1CBA85C0F3ADE8D7493EBAFD81890EA7E72F14A432FAD5DD63CA577BB5C63F7_1512539524748_file.png">
<figcaption>
Fig 3: A chart grabbed by the highlighter
</figcaption>
</figure>

### References

The paper used as the example highlighted document is found here:

> Brown AEX, de Bivort B. The study of animal behaviour as a physical science. bioRxiv [Internet]. 2017; Available from: http://biorxiv.org/content/early/2017/11/17/220855.abstract
