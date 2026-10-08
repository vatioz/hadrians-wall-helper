# Rulebook Reference

Obtain the rulebook from [Garphill Games' official Hadrian's Wall page](https://garphill.com/games/hadrians-wall).
The copyrighted PDF is not supplied by this repository or its published site.

## Local-Only Setup

For private reference work, place your lawfully obtained copy at
`rulebook/HadriansWallRulebook.pdf`. The extraction script reads that path and
writes to `rulebook/extracted/`; both are ignored by Git. Do not commit the PDF
or generated text, HTML, images, or OCR, and do not copy them into `public/` or
`build/`. Only this guide and the extraction script belong in source control.

The output descriptions below refer to the 24-page, unencrypted August 2020
rulebook used for the original local extraction. File links below work only
after generating the outputs locally; they are not hosted downloads.

## Reading the Rules

Start with [text.txt](extracted/text.txt) for searches and readable rules, or
[text-layout.txt](extracted/text-layout.txt) to retain approximate columns.
The full-document text uses form-feed characters to separate PDF pages.

For precise page references, use `extracted/pages/page-NN.txt` together with
`extracted/pages/page-NN.png`. Numbering is one-based and includes the cover.
All 24 pages have native text and 150-DPI PNGs. Page images retain diagrams,
icons, card artwork, and the original visual layout.

Useful starting points:

| PDF Page | Topic | Native Text | Original Layout |
| --- | --- | --- | --- |
| 22 | Scoring example and changes for 1-2 players, including solo play | [Text](extracted/pages/page-22.txt) | [Image](extracted/pages/page-22.png) |
| 23 | Path card scoring conditions | [Text](extracted/pages/page-23.txt) | [Image](extracted/pages/page-23.png) |
| 24 | Icon reference | [Text](extracted/pages/page-24.txt) | [Image](extracted/pages/page-24.png) |

The reconstructed [HTML rulebook](extracted/html/rulebook.html) has positioned,
selectable text and page background images. It can be opened directly in a
browser without a server. Its font metrics and reading order are approximate;
the source PDF and rendered PNGs are the visual reference.

## Machine-Readable Outputs

| Output | Purpose |
| --- | --- |
| [text-bounds.xhtml](extracted/text-bounds.xhtml) | Native text grouped by page, block, line, and word, with word bounding boxes in PDF points. The extraction contains 7,360 words. |
| `extracted/ocr/page-NN.txt` | Supplemental English OCR of each full-page PNG, including text baked into images. |
| `extracted/ocr/page-NN.hocr` | OCR words, recognition confidence, and bounding boxes in rendered-image pixels. |
| `extracted/images/` | 880 embedded-image files, including repeated occurrences and separate masks; names include the PDF page number. Original JPEG/JPEG2000 encodings are retained where supported. |
| [images.txt](extracted/images.txt) | Image inventory with page, dimensions, encoding, object IDs, resolution, and mask relationships. |
| [fonts.txt](extracted/fonts.txt) | Font inventory, embedding information, and Unicode mapping status. |
| [metadata.txt](extracted/metadata.txt) | Document properties, page count, dimensions, and encryption status. |
| [metadata.xmp](extracted/metadata.xmp) | Embedded XML metadata. |
| [source.sha256](extracted/source.sha256) | Checksum of the PDF used for this extraction. |

Native text is preferable to OCR. Selectable PDF text does not include every
word in image-based labels, and inline icons may be absent from text output.
OCR is supplemental and can misread stylized card names, numbers, or symbols;
the OCR run also reported image-region warnings. It is not merged into or
used to correct the native text. Verify any rule used as a test expectation
against the page image and cite the PDF page.

An extracted image can be only one layer of a diagram; masks may need combining
with their corresponding images. Use full-page PNGs when placement, composite
artwork, or vector shapes matter. Text coordinates use PDF points, whereas OCR
coordinates use pixels; at 150 DPI the scale is 150/72 pixels per PDF point.

## Regenerating

On Debian, install the extraction and OCR tools:

```bash
sudo apt-get update
sudo apt-get install poppler-utils tesseract-ocr tesseract-ocr-eng
```

From the repository root, run:

```bash
bash rulebook/extract.sh
sha256sum --check rulebook/extracted/source.sha256
```

The script regenerates native text, layout data, HTML, embedded images, page
renders, and OCR without changing the source PDF or application files. Generated
output is approximately 49 MiB. Tools installed in the running container may
need reinstalling after a dev-container rebuild.