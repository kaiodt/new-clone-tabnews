function status(request, response) {
  response.status(200).json({ status: "Application is OK." });
}

export default status;
