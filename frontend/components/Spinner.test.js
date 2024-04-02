// Import the Spinner component into this file and test
// that it renders what it should for the different props it can take.
import React from "react"
import { render, screen } from "@testing-library/react"
import Spinner from "./Spinner"
beforeEach(() => render(<Spinner on={true}/>))
test('spinner works accordingly', () => {
  expect(screen.getByText('Please wait...'))
})
