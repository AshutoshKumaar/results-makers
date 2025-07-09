import React from 'react'

function Footer() {
  return (
    <div>
       <footer className="bg-gray-800 text-white text-center py-4">
      <div className="container mx-auto">
        <p className="text-sm">&copy; {new Date().getFullYear()} SRN Public School. All rights reserved.</p>
      </div>
    </footer>
    </div>
  )
}

export default Footer
