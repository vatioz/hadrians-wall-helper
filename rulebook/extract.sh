#!/usr/bin/env bash
set -euo pipefail

rulebook_dir="$(dirname -- "$0")"
source_pdf="$rulebook_dir/HadriansWallRulebook.pdf"
output_dir="$rulebook_dir/extracted"

for tool in pdfinfo pdffonts pdftotext pdftohtml pdfimages pdftoppm tesseract; do
  if ! command -v "$tool" > /dev/null 2>&1; then
    printf 'Missing %s. Install poppler-utils, tesseract-ocr, and tesseract-ocr-eng.\n' "$tool" >&2
    exit 1
  fi
done

mkdir -p "$output_dir/pages" "$output_dir/images" "$output_dir/html" "$output_dir/ocr"

pdfinfo "$source_pdf" > "$output_dir/metadata.txt"
pdfinfo -meta "$source_pdf" > "$output_dir/metadata.xmp"
pdffonts "$source_pdf" > "$output_dir/fonts.txt"
pdfimages -list "$source_pdf" > "$output_dir/images.txt"
sha256sum "$source_pdf" > "$output_dir/source.sha256"

pdftotext -enc UTF-8 "$source_pdf" "$output_dir/text.txt"
pdftotext -layout -enc UTF-8 "$source_pdf" "$output_dir/text-layout.txt"
pdftotext -bbox-layout -enc UTF-8 "$source_pdf" "$output_dir/text-bounds.xhtml"
pdftohtml -c -s -noframes -enc UTF-8 "$source_pdf" "$output_dir/html/rulebook.html"
pdfimages -all -p "$source_pdf" "$output_dir/images/image"
pdftoppm -r 150 -png "$source_pdf" "$output_dir/pages/page"

page_count="$(awk '/^Pages:/ { print $2 }' "$output_dir/metadata.txt")"
for ((page_number = 1; page_number <= page_count; page_number++)); do
  printf -v page_label '%02d' "$page_number"
  pdftotext -f "$page_number" -l "$page_number" -layout -enc UTF-8 \
    "$source_pdf" "$output_dir/pages/page-$page_label.txt"
  tesseract "$output_dir/pages/page-$page_label.png" "$output_dir/ocr/page-$page_label" \
    -l eng --dpi 150 txt hocr
done

printf 'Extracted %s PDF pages into %s\n' "$page_count" "$output_dir"